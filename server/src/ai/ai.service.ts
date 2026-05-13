import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionService } from 'src/common/subscription.service';
import { GenerateChangelogDto, PRInput, GeneratedChangelog } from './dto/ai.dto';

interface GeminiCandidate {
  content: {
    parts: { text: string }[];
  };
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

interface GeminiJsonOutput {
  title: string;
  content: string;
  suggestedTags: string[];
}

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private subscription: SubscriptionService,
  ) { }

  private buildPrompt(prs: PRInput[]): string {
    const prList = prs
      .map(
        (pr, i) =>
          `PR ${i + 1}:
Title: ${pr.title}
Author: ${pr.author}
Description: ${pr.body ?? 'No description provided'}`,
      )
      .join('\n\n');

    return `You are a technical writer helping developers write clear, user-friendly changelog entries.

Based on the following GitHub pull requests, generate a changelog entry.

${prList}

Rules:
- Write for end users, not developers. Avoid technical jargon.
- The title should be concise and describe the VALUE to the user, not the implementation.
- The content should use markdown with ## headings and bullet points where appropriate.
- Keep content under 300 words.
- suggestedTags must be from this list only: FEATURE, BUG_FIX, IMPROVEMENT, SECURITY, PERFORMANCE, BREAKING_CHANGE

Respond ONLY with valid JSON in this exact format, no markdown, no preamble:
{
  "title": "Short user-facing title",
  "content": "## What changed\\n\\nMarkdown content here...",
  "suggestedTags": ["FEATURE"]
}`;
  }

  private async callGemini(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('Gemini API key not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,      // Lower = more consistent output
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new InternalServerErrorException(`Gemini API error: ${error}`);
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new InternalServerErrorException('Gemini returned empty response');
    }

    return text;
  }

  private parseGeminiResponse(raw: string): GeminiJsonOutput {
    try {
      const cleaned = raw
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleaned) as GeminiJsonOutput;

      if (!parsed.title || !parsed.content || !Array.isArray(parsed.suggestedTags)) {
        throw new Error('Invalid structure');
      }

      return parsed;
    } catch {
      throw new InternalServerErrorException(
        'AI returned invalid format. Please try again.',
      );
    }
  }

  async generate(
    orgId: string,
    dto: GenerateChangelogDto,
  ): Promise<GeneratedChangelog> {
    await this.subscription.canUseAI(orgId);

    const project = await this.prisma.project.findFirst({
      where: { id: dto.projectId, orgId },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const prs = await this.prisma.githubPR.findMany({
      where: {
        id: { in: dto.prIds },
        projectId: dto.projectId,
      },
      select: {
        prNumber: true,
        title: true,
        body: true,
        author: true,
      },
    });

    if (prs.length === 0) {
      throw new BadRequestException(
        'No PRs found with the provided IDs. Import PRs first.',
      );
    }

    const prompt = this.buildPrompt(prs as PRInput[]);
    const rawResponse = await this.callGemini(prompt);

    const parsed = this.parseGeminiResponse(rawResponse);

    return {
      title: parsed.title,
      content: parsed.content,
      suggestedTags: parsed.suggestedTags,
      aiDraft: rawResponse,
    };
  }
}