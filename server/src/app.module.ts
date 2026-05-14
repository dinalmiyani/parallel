import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { ProjectsModule } from './projects/projects.module';
import { ChangelogModule } from './changelog/changelog.module';
import { GithubModule } from './github/github.module';
import { AiModule } from './ai/ai.module';
import { WebhooksController } from './clerk/webhooks/webhooks.controller';
import { SubscribersModule } from './subscribers/subscribers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CommonModule,
    ProjectsModule,
    ChangelogModule,
    GithubModule,
    AiModule,
    SubscribersModule
  ],
  controllers: [
    AppController,
    WebhooksController,
  ],
  providers: [AppService],
})
export class AppModule { }