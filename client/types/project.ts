export interface Project {
  id: string;
  repoOwner: string;
  repoName: string;
  entriesCount: number;
  unusedPRsCount: number;
  defaultBranch: string;
  lastPublishedAt: string | null;
}

export interface ProjectDetail {
  id: string;
  name: string;
  repoName: string;
  repoOwner: string;
  githubRepoId?: number;
  defaultBranch?: string;
  createdAt?: string;
  entriesCount: number;
  unusedPRsCount: number;
  lastPublishedAt: string | null;
}

export interface EntryListItem {
  id: string;
  title: string;
  version: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  projectId?: string;
  projectName: string;
  linkedPRsCount: number;
}

export interface StoredPR {
  id: string;
  prNumber: number;
  title: string;
  body: string | null;
  author: string;
  mergedAt: string;
  used: boolean;
  projectId: string;
}