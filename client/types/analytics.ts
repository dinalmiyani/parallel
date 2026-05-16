export interface AnalyticsData {
  stats: {
    totalSubscribers: number;
    totalEntries: number;
    publishedEntries: number;
    prsProcessed: number;
    aiGenerationsUsed: number;
  };
  subscriberGrowth: {
    date: string; // ISO date string
    count: number; // cumulative count on that day
  }[];
  entriesByTag: {
    tag: string;
    count: number;
  }[];
  recentActivity: {
    id: string;
    title: string;
    version: string | null;
    isPublished: boolean;
    createdAt: string;
    projectName: string;
  }[];
}