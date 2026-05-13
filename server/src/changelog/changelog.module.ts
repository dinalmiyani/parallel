import { Module } from '@nestjs/common';
import { ChangelogController, PublicChangelogController } from './changelog.controller';
import { ChangelogService } from './changelog.service';

@Module({
  controllers: [
    ChangelogController, 
    PublicChangelogController,
  ],
  providers: [ChangelogService],
  exports: [ChangelogService],
})
export class ChangelogModule {}