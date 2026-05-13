import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { OrgId } from 'src/common/decorators/auth.decorators';
import { AiService } from './ai.service';
import { GenerateChangelogDto, GeneratedChangelog } from './dto/ai.dto';

@Controller('ai')
@UseGuards(ClerkAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  generate(
    @Body() dto: GenerateChangelogDto,
    @OrgId() orgId: string,
  ): Promise<GeneratedChangelog> {
    return this.aiService.generate(orgId, dto);
  }
}