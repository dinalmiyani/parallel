import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionService } from 'src/common/subscription.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private subscription: SubscriptionService,
  ) { }

  async findAll(orgId: string) {
    const projects = await this.prisma.project.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            entries: true,
            pullRequests: { where: { used: false } }, // unused PRs count
          },
        },
        entries: {
          where: { isPublished: true },
          orderBy: { publishedAt: 'desc' },
          take: 1,
          select: { publishedAt: true },
        },
      },
    });

    return projects.map((p) => ({
      id: p.id,
      name: p.name,
      repoName: p.repoName,
      repoOwner: p.repoOwner,
      githubRepoId: p.githubRepoId,
      defaultBranch: p.defaultBranch,
      createdAt: p.createdAt,
      entriesCount: p._count.entries,
      unusedPRsCount: p._count.pullRequests,
      lastPublishedAt: p.entries[0]?.publishedAt ?? null,
    }));
  }

  // ── Get single project (must belong to org) ───────────────────────────────
  async findOne(id: string, orgId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, orgId },
      include: {
        _count: {
          select: {
            entries: true,
            pullRequests: { where: { used: false } },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project not found`);
    }

    return project;
  }

  // ── Connect a new repo 
  async create(orgId: string, dto: CreateProjectDto) {
    // Check plan limit before creating
    await this.subscription.canAddProject(orgId);

    const existing = await this.prisma.project.findFirst({
      where: { orgId, githubRepoId: dto.githubRepoId },
    });

    if (existing) {
      throw new ConflictException(
        `This repository is already connected to your workspace.`,
      );
    }

    return this.prisma.project.create({
      data: {
        name: dto.name,
        repoName: dto.repoName,
        repoOwner: dto.repoOwner,
        githubRepoId: dto.githubRepoId,
        defaultBranch: dto.defaultBranch ?? 'main',
        orgId,
      },
    });
  }

  async update(id: string, orgId: string, dto: UpdateProjectDto) {
    await this.findOne(id, orgId);

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.defaultBranch && { defaultBranch: dto.defaultBranch }),
      },
    });
  }

  async remove(id: string, orgId: string) {
    await this.findOne(id, orgId);

    // Cascade handled by Prisma schema (onDelete: Cascade)
    // Deletes: project → pullRequests, entries, entryPRs
    await this.prisma.project.delete({ where: { id } });

    return { message: 'Project disconnected successfully' };
  }
}