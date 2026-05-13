import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class GenerateChangelogDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  prIds!: string[];
}

export interface PRInput {
  prNumber: number;
  title: string;
  body: string | null;
  author: string;
}

export interface GeneratedChangelog {
  title: string;
  content: string; 
  suggestedTags: string[];
  aiDraft: string;
}