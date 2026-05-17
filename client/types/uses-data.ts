export interface UsageData {
  plan: string;
  limits: {
    maxProjects: number | null;
    maxEntries: number | null;
    maxAiGenerations: number | null;
    maxMembers: number | null;
  };
  usage: {
    projects: number;
    entries: number;
    aiGenerations: number;
    members: number;
  };
  features: {
    emailNotifications: boolean;
    customDomain: boolean;
    removeBranding: boolean;
  };
}