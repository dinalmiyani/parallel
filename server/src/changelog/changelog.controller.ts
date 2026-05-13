import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { OrgId } from 'src/common/decorators/auth.decorators';
import { ChangelogService } from './changelog.service';
import { CreateEntryDto, UpdateEntryDto, PublishEntryDto } from './dto/changelog.dto';
import { EntryListItem, EntryDetail, PublicEntryItem } from './changelog.types';

@Controller('public/changelog')
export class PublicChangelogController {
  constructor(private readonly changelogService: ChangelogService) { }

  @Get(':slug')
  async findPublic(@Param('slug') slug: string): Promise<{
    workspace: { name: string; logo: string | null; brandColor: string };
    entries: PublicEntryItem[];
  }> {
    return this.changelogService.findPublic(slug);
  }
}

@Controller('changelog')
@UseGuards(ClerkAuthGuard)
export class ChangelogController {
  constructor(private readonly changelogService: ChangelogService) { }

  @Get()
  findAll(
    @OrgId() orgId: string,
    @Query('projectId') projectId?: string,
  ): Promise<EntryListItem[]> {
    return this.changelogService.findAll(orgId, projectId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @OrgId() orgId: string,
  ): Promise<EntryDetail> {
    return this.changelogService.findOne(id, orgId);
  }

  @Post()
  create(
    @Body() dto: CreateEntryDto,
    @OrgId() orgId: string,
  ): Promise<EntryDetail> {
    return this.changelogService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEntryDto,
    @OrgId() orgId: string,
  ): Promise<EntryDetail> {
    return this.changelogService.update(id, orgId, dto);
  }

  @Patch(':id/publish')
  publish(
    @Param('id') id: string,
    @Body() dto: PublishEntryDto,
    @OrgId() orgId: string,
  ): Promise<EntryDetail> {
    return this.changelogService.publish(id, orgId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id') id: string,
    @OrgId() orgId: string,
  ): Promise<{ message: string }> {
    return this.changelogService.remove(id, orgId);
  }
}