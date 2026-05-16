
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { OrgId } from 'src/common/decorators/auth.decorators';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(ClerkAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get()
  getAnalytics(@OrgId() orgId: string) {
    return this.analyticsService.getAnalytics(orgId);
  }
}