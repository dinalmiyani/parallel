import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum Tag {
  FEATURE = 'FEATURE',
  BUG_FIX = 'BUG_FIX',
  IMPROVEMENT = 'IMPROVEMENT',
  SECURITY = 'SECURITY',
  PERFORMANCE = 'PERFORMANCE',
  BREAKING_CHANGE = 'BREAKING_CHANGE',
}

export class CreateEntryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(300)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  version?: string;

  @IsArray()
  @IsEnum(Tag, { each: true })
  @IsOptional()
  tags?: Tag[] = [];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = false;

  @IsString()
  @IsOptional()
  aiDraft?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  prIds?: string[] = [];
}

export class UpdateEntryDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(300)
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  version?: string;

  @IsArray()
  @IsEnum(Tag, { each: true })
  @IsOptional()
  tags?: Tag[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsString()
  @IsOptional()
  aiDraft?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  prIds?: string[];
}

export class PublishEntryDto {
  @IsBoolean()
  isPublished!: boolean;

  @IsBoolean()
  @IsOptional()
  notifySubscribers?: boolean = true;
}