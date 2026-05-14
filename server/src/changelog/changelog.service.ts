import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionService } from 'src/common/subscription.service';
import { CreateEntryDto, UpdateEntryDto, PublishEntryDto, Tag } from './dto/changelog.dto';
import { EntryListItem, EntryDetail, PublicEntryItem } from './changelog.types';
import { SubscribersService } from 'src/subscribers/subscribers.service';

@Injectable()
export class ChangelogService {
  constructor(
    private prisma: PrismaService,
    private subscription: SubscriptionService,
    private subscribersService: SubscribersService,
  ) { }

  private readonly listSelect = {
    id: true,
    title: true,
    version: true,
    tags: true,
    isPublished: true,
    publishedAt: true,
    createdAt: true,
    updatedAt: true,
    projectId: true,
    project: {
      select: {
        id: true,
        name: true,
        repoName: true,
        repoOwner: true,
        orgId: true,
      },
    },
    _count: {
      select: { sourcePRs: true },
    },
  } as const;

  private readonly detailSelect = {
    id: true,
    title: true,
    content: true,
    version: true,
    tags: true,
    isPublished: true,
    publishedAt: true,
    aiDraft: true,
    createdAt: true,
    updatedAt: true,
    projectId: true,
    project: {
      select: {
        id: true,
        name: true,
        repoName: true,
        repoOwner: true,
        orgId: true,
      },
    },
    sourcePRs: {
      select: {
        pr: {
          select: {
            id: true,
            prNumber: true,
            title: true,
            author: true,
            mergedAt: true,
          },
        },
      },
    },
  } as const;

  private async verifyOwnership(entryId: string, orgId: string) {
    const entry = await this.prisma.changelogEntry.findFirst({
      where: {
        id: entryId,
        project: { orgId },
      },
      select: { id: true, isPublished: true },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    return entry;
  }

  private formatListItem(entry: {
    id: string;
    title: string;
    version: string | null;
    tags: string[];
    isPublished: boolean;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    projectId: string;
    project: { id: string; name: string; repoName: string; repoOwner: string; orgId: string };
    _count: { sourcePRs: number };
  }): EntryListItem {
    return {
      id: entry.id,
      title: entry.title,
      version: entry.version,
      tags: entry.tags as Tag[],
      isPublished: entry.isPublished,
      publishedAt: entry.publishedAt,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      projectId: entry.projectId,
      projectName: entry.project.name,
      linkedPRsCount: entry._count.sourcePRs,
    };
  }

  async findAll(orgId: string, projectId?: string): Promise<EntryListItem[]> {
    const entries = await this.prisma.changelogEntry.findMany({
      where: {
        project: {
          orgId,
          ...(projectId && { id: projectId }),
        },
      },
      orderBy: { createdAt: 'desc' },
      select: this.listSelect,
    });

    return entries.map((e) => this.formatListItem(e));
  }

  async findOne(id: string, orgId: string): Promise<EntryDetail> {
    const entry = await this.prisma.changelogEntry.findFirst({
      where: {
        id,
        project: { orgId },
      },
      select: this.detailSelect,
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    return {
      id: entry.id,
      title: entry.title,
      content: entry.content,
      version: entry.version,
      tags: entry.tags as Tag[],
      isPublished: entry.isPublished,
      publishedAt: entry.publishedAt,
      aiDraft: entry.aiDraft,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      projectId: entry.projectId,
      projectName: entry.project.name,
      linkedPRsCount: entry.sourcePRs.length,
      project: {
        id: entry.project.id,
        name: entry.project.name,
        repoName: entry.project.repoName,
        repoOwner: entry.project.repoOwner,
      },
      linkedPRs: entry.sourcePRs.map((sp) => sp.pr),
    };
  }

  async findPublic(slug: string): Promise<{
    workspace: { name: string; logo: string | null; brandColor: string };
    entries: PublicEntryItem[];
  }> {
    const workspace = await this.prisma.organization.findUnique({
      where: { slug },
      select: { name: true, logo: true, brandColor: true },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const entries = await this.prisma.changelogEntry.findMany({
      where: {
        isPublished: true,
        project: { organization: { slug } },
      },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        version: true,
        tags: true,
        content: true,
        publishedAt: true,
      },
    });

    return {
      workspace,
      entries: entries.map((e) => ({
        ...e,
        tags: e.tags as Tag[],
        publishedAt: e.publishedAt!, // Always set for published entries
      })),
    };
  }

  async create(orgId: string, dto: CreateEntryDto): Promise<EntryDetail> {
    await this.subscription.canCreateEntry(orgId);

    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, orgId },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const entry = await this.prisma.$transaction(async (tx) => {
      const created = await tx.changelogEntry.create({
        data: {
          title: dto.title,
          content: dto.content,
          version: dto.version,
          tags: dto.tags ?? [],
          isPublished: dto.isPublished ?? false,
          publishedAt: dto.isPublished ? new Date() : null,
          aiDraft: dto.aiDraft,
          projectId: dto.projectId,
        },
      });

      if (dto.prIds && dto.prIds.length > 0) {
        await tx.changelogEntryPR.createMany({
          data: dto.prIds.map((prId) => ({
            entryId: created.id,
            prId,
          })),
          skipDuplicates: true,
        });

        await tx.githubPR.updateMany({
          where: { id: { in: dto.prIds } },
          data: { used: true },
        });
      }

      return created;
    });

    return this.findOne(entry.id, orgId);
  }

  async update(
    id: string,
    orgId: string,
    dto: UpdateEntryDto,
  ): Promise<EntryDetail> {
    await this.verifyOwnership(id, orgId);

    await this.prisma.$transaction(async (tx) => {
      await tx.changelogEntry.update({
        where: { id },
        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.content !== undefined && { content: dto.content }),
          ...(dto.version !== undefined && { version: dto.version }),
          ...(dto.tags !== undefined && { tags: dto.tags }),
          ...(dto.aiDraft !== undefined && { aiDraft: dto.aiDraft }),
        },
      });

      if (dto.prIds !== undefined) {
        await tx.changelogEntryPR.deleteMany({ where: { entryId: id } });

        if (dto.prIds.length > 0) {
          await tx.changelogEntryPR.createMany({
            data: dto.prIds.map((prId) => ({ entryId: id, prId })),
            skipDuplicates: true,
          });

          await tx.githubPR.updateMany({
            where: { id: { in: dto.prIds } },
            data: { used: true },
          });
        }
      }
    });

    return this.findOne(id, orgId);
  }

  async publish(
    id: string,
    orgId: string,
    dto: PublishEntryDto,
  ): Promise<EntryDetail> {
    await this.verifyOwnership(id, orgId);

    await this.prisma.changelogEntry.update({
      where: { id },
      data: {
        isPublished: dto.isPublished,
        publishedAt: dto.isPublished ? new Date() : null,
      },
    });

    if (dto.isPublished && dto.notifySubscribers !== false) {
      this.subscribersService
        .notifySubscribers(orgId, id)
        .then(({ sent }) => {
          console.log(`[ChangelogService] Notified ${sent} subscribers for entry ${id}`);
        })
        .catch((err) => {
          console.error('[ChangelogService] Subscriber notification failed:', err);
        });
    }

    return this.findOne(id, orgId);
  }

  async remove(id: string, orgId: string): Promise<{ message: string }> {
    await this.verifyOwnership(id, orgId);

    await this.prisma.changelogEntry.delete({ where: { id } });

    return { message: 'Entry deleted successfully' };
  }

  async getMonthlyCount(orgId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.prisma.changelogEntry.count({
      where: {
        project: { orgId },
        createdAt: { gte: startOfMonth },
      },
    });
  }
}