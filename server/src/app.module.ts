import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { ProjectsModule } from './projects/projects.module';
import { WebhooksController } from './clerk/webhooks/webhooks.controller';

@Module({
  imports: [
    // Load .env globally — isGlobal means no need to import in each module
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CommonModule,
    ProjectsModule,
    // ChangelogModule 
    // GithubModule
    // AiModule  
    // SubscribersModule 
  ],
  controllers: [
    AppController,
    WebhooksController,
  ],
  providers: [AppService],
})
export class AppModule {}