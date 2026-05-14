import {
  Controller,
  Get,
  Post,
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
import { SubscribersService } from './subscribers.service';
import { SubscribeDto, SubscriberItem, SubscribeResult } from './dto/subscribers.dto';

@Controller('public')
export class PublicSubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  subscribe(@Body() dto: SubscribeDto): Promise<SubscribeResult> {
    return this.subscribersService.subscribe(dto);
  }

  @Get('confirm-email')
  confirmEmail(@Query('token') token: string): Promise<{ message: string }> {
    return this.subscribersService.confirmEmail(token);
  }

  @Get('unsubscribe')
  unsubscribe(@Query('token') token: string): Promise<{ message: string }> {
    return this.subscribersService.unsubscribe(token);
  }
}

@Controller('subscribers')
@UseGuards(ClerkAuthGuard)
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Get()
  findAll(@OrgId() orgId: string): Promise<SubscriberItem[]> {
    return this.subscribersService.findAll(orgId);
  }

  @Post(':entryId/notify')
  notify(
    @Param('entryId') entryId: string,
    @OrgId() orgId: string,
  ): Promise<{ sent: number }> {
    return this.subscribersService.notifySubscribers(orgId, entryId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id') id: string,
    @OrgId() orgId: string,
  ): Promise<{ message: string }> {
    return this.subscribersService.remove(id, orgId);
  }
}