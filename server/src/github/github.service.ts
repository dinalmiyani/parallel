import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ImportPRsDto,
  GitHubPRResponse,
  GitHubRepo,
  StoredPR,
  ImportResult,
} from './dto/github.dto';

@Injectable()
export class GithubService {
  constructor(private prisma: PrismaService) { }

  async getConnectionStatus(userId: string): Promise<{ connected: boolean }> {
    try {
      await this.getGitHubToken(userId);
      return { connected: true };
    } catch {
      return { connected: false };
    }
  }

  private async getGitHubToken(userId: string): Promise<string> {
    const response = await fetch(
      `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/oauth_github`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      },
    );

    if (!response.ok) {
      throw new UnauthorizedException(
        'GitHub account not connected. Please connect GitHub in your account settings.',
      );
    }

    const data = (await response.json()) as { token: string }[];

    if (!data[0]?.token) {
      throw new UnauthorizedException(
        'GitHub access token not found. Please reconnect your GitHub account.',
      );
    }

    return data[0].token;
  }

  private async githubFetch<T>(
    endpoint: string,
    token: string,
  ): Promise<T> {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new UnauthorizedException('GitHub token expired. Please reconnect GitHub.');
      }
      if (response.status === 404) {
        throw new NotFoundException('GitHub repository not found or no access.');
      }
      throw new BadRequestException(`GitHub API error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async listRepos(userId: string): Promise<GitHubRepo[]> {
    const token = await this.getGitHubToken(userId);

    const repos = await this.githubFetch<GitHubRepo[]>(
      '/user/repos?sort=pushed&per_page=100&type=all',
      token,
    );

    return repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      owner: { login: repo.owner.login },
      private: repo.private,
      language: repo.language,
      default_branch: repo.default_branch,
      description: repo.description,
      pushed_at: repo.pushed_at,
    }));
  }

  async importPRs(
    orgId: string,
    userId: string,
    dto: ImportPRsDto,
  ): Promise<ImportResult> {
    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, orgId },
      select: {
        id: true,
        repoOwner: true,
        repoName: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const token = await this.getGitHubToken(userId);

    const perPage = dto.perPage ?? 30;
    const githubPRs = await this.githubFetch<GitHubPRResponse[]>(
      `/repos/${project.repoOwner}/${project.repoName}/pulls?state=closed&per_page=${perPage}&sort=updated`,
      token,
    );

    const mergedPRs = githubPRs.filter((pr) => pr.merged_at !== null);

    if (mergedPRs.length === 0) {
      return { imported: 0, skipped: 0, total: 0, prs: [] };
    }

    const existingPRNumbers = await this.prisma.githubPR
      .findMany({
        where: {
          projectId: project.id,
          prNumber: { in: mergedPRs.map((pr) => pr.number) },
        },
        select: { prNumber: true },
      })
      .then((prs) => new Set(prs.map((pr) => pr.prNumber)));

    const newPRs = mergedPRs.filter(
      (pr) => !existingPRNumbers.has(pr.number),
    );

    if (newPRs.length > 0) {
      await this.prisma.githubPR.createMany({
        data: newPRs.map((pr) => ({
          prNumber: pr.number,
          title: pr.title,
          body: pr.body,
          author: pr.user.login,
          mergedAt: new Date(pr.merged_at!),
          projectId: project.id,
          used: false,
        })),
        skipDuplicates: true,
      });
    }

    const allPRs = await this.prisma.githubPR.findMany({
      where: { projectId: project.id },
      orderBy: { mergedAt: 'desc' },
    });

    return {
      imported: newPRs.length,
      skipped: mergedPRs.length - newPRs.length,
      total: mergedPRs.length,
      prs: allPRs as StoredPR[],
    };
  }

  async getPRs(
    orgId: string,
    projectId: string,
    onlyUnused = false,
  ): Promise<StoredPR[]> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, orgId },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const prs = await this.prisma.githubPR.findMany({
      where: {
        projectId,
        ...(onlyUnused && { used: false }),
      },
      orderBy: { mergedAt: 'desc' },
    });

    return prs as StoredPR[];
  }
}