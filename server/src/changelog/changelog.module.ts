import { Module } from '@nestjs/common';
import { ChangelogController, PublicChangelogController } from './changelog.controller';
import { ChangelogService } from './changelog.service';
import { SubscribersModule } from 'src/subscribers/subscribers.module';

@Module({
  imports: [SubscribersModule],
  controllers: [
    ChangelogController,
    PublicChangelogController,
  ],
  providers: [ChangelogService],
  exports: [ChangelogService],
})
export class ChangelogModule { }