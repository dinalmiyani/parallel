export interface Project {
  id: string;
  repoOwner: string;
  repoName: string;
  entriesCount: number;
  unusedPRsCount: number;
  defaultBranch: string;
  lastPublishedAt: string | null;
}