import { IsString, IsOptional, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateGeneralDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(48)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug?: string;
}

export class UpdateBrandingDto {
  @IsString()
  @IsOptional()
  logo?: string; // URL after upload

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Brand color must be a valid hex color (e.g. #2563EB)',
  })
  brandColor?: string;

  @IsString()
  @IsOptional()
  domain?: string; // custom domain (Pro feature)
}
