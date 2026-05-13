import { Tag } from './dto/changelog.dto';

export interface ChangelogEntryWithRelations {
  id: string;
  title: string;
  content: string;
  version: string | null;
  tags: Tag[];
  isPublished: boolean;
  publishedAt: Date | null;
  aiDraft: string | null;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  project: {
    id: string;
    name: string;
    repoName: string;
    repoOwner: string;
    orgId: string;
  };
  sourcePRs: {
    pr: {
      id: string;
      prNumber: number;
      title: string;
      author: string;
      mergedAt: Date;
    };
  }[];
}

export interface EntryListItem {
  id: string;
  title: string;
  version: string | null;
  tags: Tag[];
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  projectName: string;
  linkedPRsCount: number;
}

export interface EntryDetail extends EntryListItem {
  content: string;
  aiDraft: string | null;
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
    mergedAt: Date;
  }[];
}

export interface PublicEntryItem {
  id: string;
  title: string;
  version: string | null;
  tags: Tag[];
  content: string;
  publishedAt: Date;
}