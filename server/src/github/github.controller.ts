import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { OrgId, UserId } from 'src/common/decorators/auth.decorators';
import { GithubService } from './github.service';
import { ImportPRsDto, GitHubRepo, StoredPR, ImportResult } from './dto/github.dto';

@Controller('github')
@UseGuards(ClerkAuthGuard)
export class GithubController {
  constructor(private readonly githubService: GithubService) { }

  @Get('status')
  async getStatus(@UserId() userId: string): Promise<{ connected: boolean }> {
    return this.githubService.getConnectionStatus(userId);
  }

  @Get('repos')
  listRepos(@UserId() userId: string): Promise<GitHubRepo[]> {
    return this.githubService.listRepos(userId);
  }

  @Get('prs/:projectId')
  getPRs(
    @Param('projectId') projectId: string,
    @OrgId() orgId: string,
    @Query('unused') unused?: string,
  ): Promise<StoredPR[]> {
    return this.githubService.getPRs(orgId, projectId, unused === 'true');
  }

  @Post('import')
  importPRs(
    @Body() dto: ImportPRsDto,
    @OrgId() orgId: string,
    @UserId() userId: string,
  ): Promise<ImportResult> {
    return this.githubService.importPRs(orgId, userId, dto);
  }
}