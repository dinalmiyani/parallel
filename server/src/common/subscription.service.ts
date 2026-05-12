import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PLAN_LIMITS } from './plan-limits';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) { }

  async getOrg(orgId: string) {
    return this.prisma.organization.findUniqueOrThrow({
      where: { id: orgId },
    });
  }

  private getStartOfMonth(): Date {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  async canAddProject(orgId: string): Promise<void> {
    const org = await this.getOrg(orgId);
    const limits = PLAN_LIMITS[org.plan as keyof typeof PLAN_LIMITS];
    const count = await this.prisma.project.count({ where: { orgId } });

    if (count >= limits.maxProjects) {
      throw new ForbiddenException(
        `Your ${org.plan} plan allows ${limits.maxProjects} repo(s). Upgrade to connect more.`,
      );
    }
  }

  async canCreateEntry(orgId: string): Promise<void> {
    const org = await this.getOrg(orgId);
    const limits = PLAN_LIMITS[org.plan as keyof typeof PLAN_LIMITS];

    if (limits.maxEntries === Infinity) return;

    const count = await this.prisma.changelogEntry.count({
      where: {
        project: { orgId },
        createdAt: { gte: this.getStartOfMonth() },
      },
    });

    if (count >= limits.maxEntries) {
      throw new ForbiddenException(
        `You've used all ${limits.maxEntries} entries this month. Upgrade to Pro for unlimited.`,
      );
    }
  }

  async canUseAI(orgId: string): Promise<void> {
    const org = await this.getOrg(orgId);
    const limits = PLAN_LIMITS[org.plan as keyof typeof PLAN_LIMITS];

    if (limits.maxAiGenerations === Infinity) return;

    const count = await this.prisma.changelogEntry.count({
      where: {
        project: { orgId },
        aiDraft: { not: null },
        createdAt: { gte: this.getStartOfMonth() },
      },
    });

    if (count >= limits.maxAiGenerations) {
      throw new ForbiddenException(
        `You've used all ${limits.maxAiGenerations} AI generations this month. Upgrade to continue.`,
      );
    }
  }

  async requireFeature(
    orgId: string,
    feature: 'emailNotifications' | 'customDomain' | 'removeBranding',
  ): Promise<void> {
    const org = await this.getOrg(orgId);
    const limits = PLAN_LIMITS[org.plan as keyof typeof PLAN_LIMITS];

    if (!limits[feature]) {
      throw new ForbiddenException(
        `This feature is not available on your current plan. Upgrade to unlock it.`,
      );
    }
  }

  async getUsage(orgId: string) {
    const org = await this.getOrg(orgId);
    const limits = PLAN_LIMITS[org.plan as keyof typeof PLAN_LIMITS];
    const startOfMonth = this.getStartOfMonth();

    const [projectCount, entryCount, aiCount, memberCount] = await Promise.all([
      this.prisma.project.count({ where: { orgId } }),
      this.prisma.changelogEntry.count({
        where: { project: { orgId }, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.changelogEntry.count({
        where: {
          project: { orgId },
          aiDraft: { not: null },
          createdAt: { gte: startOfMonth },
        },
      }),
      this.prisma.member.count({ where: { orgId } }),
    ]);

    return {
      plan: org.plan,
      limits: {
        maxProjects: limits.maxProjects === Infinity ? null : limits.maxProjects,
        maxEntries: limits.maxEntries === Infinity ? null : limits.maxEntries,
        maxAiGenerations: limits.maxAiGenerations === Infinity ? null : limits.maxAiGenerations,
        maxMembers: limits.maxMembers === Infinity ? null : limits.maxMembers,
      },
      usage: {
        projects: projectCount,
        entries: entryCount,
        aiGenerations: aiCount,
        members: memberCount,
      },
      features: {
        emailNotifications: limits.emailNotifications,
        customDomain: limits.customDomain,
        removeBranding: limits.removeBranding,
      },
    };
  }
}