import { apiServer } from '@/lib/api/server';
import { AnalyticsData } from '@/types/analytics';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AnalyticsClient from './analytics-client';

export default async function AnalyticsPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  const data = await apiServer()
    .get<AnalyticsData>('/analytics')
    .catch((): AnalyticsData => ({
      stats: {
        totalSubscribers: 0,
        totalEntries: 0,
        publishedEntries: 0,
        prsProcessed: 0,
        aiGenerationsUsed: 0,
      },
      subscriberGrowth: [],
      entriesByTag: [],
      recentActivity: [],
    }));

  return <AnalyticsClient data={data} />;
}