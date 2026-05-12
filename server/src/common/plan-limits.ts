export const PLAN_LIMITS = {
  FREE: {
    maxProjects: 1,
    maxEntries: 10,
    maxAiGenerations: 5,
    maxMembers: 1,
    emailNotifications: false,
    customDomain: false,
    removeBranding: false,
  },
  PRO: {
    maxProjects: 5,
    maxEntries: Infinity,
    maxAiGenerations: Infinity,
    maxMembers: 3,
    emailNotifications: true,
    customDomain: true,
    removeBranding: false,
  },
  TEAM: {
    maxProjects: Infinity,
    maxEntries: Infinity,
    maxAiGenerations: Infinity,
    maxMembers: Infinity,
    emailNotifications: true,
    customDomain: true,
    removeBranding: true,
  },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: Plan) {
  return PLAN_LIMITS[plan];
}