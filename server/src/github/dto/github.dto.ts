import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class ImportPRsDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  perPage?: number = 30;
}

export interface GitHubPRResponse {
  number: number;
  title: string;
  body: string | null;
  merged_at: string | null;
  user: {
    login: string;
  };
  state: string;
}

export interface StoredPR {
  id: string;
  prNumber: number;
  title: string;
  body: string | null;
  author: string;
  mergedAt: Date;
  used: boolean;
  projectId: string;
  createdAt: Date;
}

export interface ImportResult {
  imported: number; 
  skipped: number;
  total: number; 
  prs: StoredPR[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  private: boolean;
  language: string | null;
  default_branch: string;
  description: string | null;
  pushed_at: string;
}