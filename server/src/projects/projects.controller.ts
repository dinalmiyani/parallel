import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { OrgId, UserId } from 'src/common/decorators/auth.decorators';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Controller('projects')
@UseGuards(ClerkAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Get()
  findAll(@OrgId() orgId: string) {
    return this.projectsService.findAll(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @OrgId() orgId: string) {
    return this.projectsService.findOne(id, orgId);
  }

  @Post()
  create(@Body() dto: CreateProjectDto, @OrgId() orgId: string) {
    return this.projectsService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @OrgId() orgId: string,
  ) {
    return this.projectsService.update(id, orgId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @OrgId() orgId: string) {
    return this.projectsService.remove(id, orgId);
  }
}