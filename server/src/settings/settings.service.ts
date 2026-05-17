import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionService } from 'src/common/subscription.service';
import { UpdateGeneralDto, UpdateBrandingDto } from './dto/settings.dto';
import { createClerkClient } from '@clerk/backend';

@Injectable()
export class SettingsService {
  private clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
  });

  constructor(
    private prisma: PrismaService,
    private subscription: SubscriptionService,
  ) { }

  async getSettings(orgId: string) {
    return this.prisma.organization.findUniqueOrThrow({
      where: { id: orgId },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        brandColor: true,
        domain: true,
        plan: true,
        createdAt: true,
        _count: { select: { members: true } },
      },
    });
  }

  async updateGeneral(orgId: string, dto: UpdateGeneralDto) {
    if (dto.slug) {
      const existing = await this.prisma.organization.findFirst({
        where: { slug: dto.slug, NOT: { id: orgId } },
        select: { id: true },
      });
      if (existing) {
        throw new ConflictException('This slug is already taken.');
      }
    }

    try {
      await this.clerk.organizations.updateOrganization(orgId, {
        ...(dto.name && { name: dto.name }),
        ...(dto.slug && { slug: dto.slug }),
      });
    } catch (err: unknown) {
      // Clerk slug conflict check
      const message = err instanceof Error ? err.message : '';
      if (message.includes('slug') && message.includes('taken')) {
        throw new ConflictException('This slug is already taken in Clerk.');
      }
      throw new InternalServerErrorException('Failed to update organization in Clerk.');
    }

    const updated = await this.prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.slug && { slug: dto.slug }),
      },
      select: { id: true, name: true, slug: true },
    });

    return updated;
  }

  async updateBranding(orgId: string, dto: UpdateBrandingDto) {
    if (dto.domain) {
      await this.subscription.requireFeature(orgId, 'customDomain');
    }

    return this.prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(dto.logo !== undefined && { logo: dto.logo }),
        ...(dto.brandColor !== undefined && { brandColor: dto.brandColor }),
        ...(dto.domain !== undefined && { domain: dto.domain }),
      },
      select: { id: true, logo: true, brandColor: true, domain: true },
    });
  }

  async checkSlug(slug: string, orgId: string): Promise<{ available: boolean }> {
    const existing = await this.prisma.organization.findFirst({
      where: { slug, NOT: { id: orgId } },
      select: { id: true },
    });
    return { available: !existing };
  }
}