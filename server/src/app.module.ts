import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WebhooksController } from './clerk/webhooks/webhooks.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, WebhooksController],
  providers: [AppService],
})
export class AppModule {}
