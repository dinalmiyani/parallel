import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { OrgId } from 'src/common/decorators/auth.decorators';
import { SubscriptionService } from 'src/common/subscription.service';

@Controller('subscription')
@UseGuards(ClerkAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscription: SubscriptionService) {}

  @Get('usage')
  getUsage(@OrgId() orgId: string) {
    return this.subscription.getUsage(orgId);
  }
}