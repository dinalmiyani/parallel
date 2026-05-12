import { IsString, IsNotEmpty, IsInt, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  repoName!: string;

  @IsString()
  @IsNotEmpty()
  repoOwner!: string;

  @IsInt()
  githubRepoId!: number;

  @IsString()
  @IsOptional()
  defaultBranch?: string = 'main';
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  defaultBranch?: string;
}