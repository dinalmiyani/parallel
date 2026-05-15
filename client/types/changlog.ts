export interface EntryListItem {
  id: string;
  title: string;
  version: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  projectName: string;
  linkedPRsCount: number;
  content?: string;
}

export interface Project {
  id: string;
  name: string;
  repoName: string;
  repoOwner: string;
}

export interface StoredPR {
  id: string;
  prNumber: number;
  title: string;
  mergedAt: string;
  used: boolean;
}

export interface AiDraftSession {
  projectId: string;
  prIds: string[];
  title: string;
  content: string;
  suggestedTags: string[];
  aiDraft: string;
}

export interface EntryDetail {
  id: string;
  title: string;
  content: string;
  version: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  aiDraft: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  projectName: string;
  linkedPRsCount: number;
  project: {
    id: string;
    name: string;
    repoName: string;
    repoOwner: string;
  };
  linkedPRs: {
    id: string;
    prNumber: number;
    title: string;
    author: string;
    mergedAt: string;
  }[];
}
