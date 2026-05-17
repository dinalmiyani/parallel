import {
  Controller, Get, Patch, Body,
  Query, UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { OrgId } from 'src/common/decorators/auth.decorators';
import { UpdateBrandingDto, UpdateGeneralDto } from './dto/settings.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(ClerkAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get()
  getSettings(@OrgId() orgId: string) {
    return this.settingsService.getSettings(orgId);
  }

  @Get('check-slug')
  checkSlug(
    @Query('slug') slug: string,
    @OrgId() orgId: string,
  ) {
    return this.settingsService.checkSlug(slug, orgId);
  }

  @Patch('general')
  updateGeneral(
    @Body() dto: UpdateGeneralDto,
    @OrgId() orgId: string,
  ) {
    return this.settingsService.updateGeneral(orgId, dto);
  }

  @Patch('branding')
  updateBranding(
    @Body() dto: UpdateBrandingDto,
    @OrgId() orgId: string,
  ) {
    return this.settingsService.updateBranding(orgId, dto);
  }
}
