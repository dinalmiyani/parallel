import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) { }

  async getAnalytics(orgId: string) {
    const [
      subscribers,
      entries,
      prsProcessed,
      entriesByTag,
      recentEntries,
      subscriberDates,
    ] = await Promise.all([

      this.prisma.subscriber.count({
        where: { orgId, confirmedAt: { not: null } },
      }),

      this.prisma.changelogEntry.findMany({
        where: { project: { orgId } },
        select: {
          id: true,
          title: true,
          version: true,
          tags: true,
          isPublished: true,
          aiDraft: true,
          createdAt: true,
          project: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.githubPR.count({
        where: { project: { orgId }, used: true },
      }),

      this.prisma.changelogEntry.findMany({
        where: { project: { orgId } },
        select: { tags: true },
      }),

      this.prisma.changelogEntry.findMany({
        where: { project: { orgId } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          version: true,
          isPublished: true,
          createdAt: true,
          project: { select: { name: true } },
        },
      }),

      this.prisma.subscriber.findMany({
        where: {
          orgId,
          confirmedAt: { not: null },
          createdAt: {
            gte: new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000),
          },
        },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const tagCounts: Record<string, number> = {};
    for (const entry of entriesByTag) {
      for (const tag of entry.tags) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
    }
    const entriesByTagFormatted = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    const now = new Date();
    const weeklyData = Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (7 - i) * 7);
      weekStart.setHours(0, 0, 0, 0);

      const label = weekStart.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const count = subscriberDates.filter(
        (s) => new Date(s.createdAt) <= weekEnd,
      ).length;

      return { date: label, count };
    });

    const aiGenerationsUsed = entries.filter((e) => e.aiDraft !== null).length;

    return {
      stats: {
        totalSubscribers: subscribers,
        totalEntries: entries.length,
        publishedEntries: entries.filter((e) => e.isPublished).length,
        prsProcessed,
        aiGenerationsUsed,
      },
      subscriberGrowth: weeklyData,
      entriesByTag: entriesByTagFormatted,
      recentActivity: recentEntries.map((e) => ({
        id: e.id,
        title: e.title,
        version: e.version,
        isPublished: e.isPublished,
        createdAt: e.createdAt.toISOString(),
        projectName: e.project.name,
      })),
    };
  }
}