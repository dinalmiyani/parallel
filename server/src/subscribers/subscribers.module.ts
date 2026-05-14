import { Module } from '@nestjs/common';
import {
  SubscribersController,
  PublicSubscribersController,
} from './subscribers.controller';
import { SubscribersService } from './subscribers.service';

@Module({
  controllers: [
    SubscribersController,
    PublicSubscribersController,
  ],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}