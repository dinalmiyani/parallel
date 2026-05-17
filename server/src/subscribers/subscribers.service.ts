import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionService } from 'src/common/subscription.service';
import {
  SubscribeDto,
  SubscriberItem,
  SubscribeResult,
} from './dto/subscribers.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class SubscribersService {
  constructor(
    private prisma: PrismaService,
    private subscription: SubscriptionService,
  ) { }

  private format(sub: {
    id: string;
    email: string;
    confirmedAt: Date | null;
    createdAt: Date;
  }): SubscriberItem {
    return {
      id: sub.id,
      email: sub.email,
      confirmedAt: sub.confirmedAt,
      createdAt: sub.createdAt,
      isConfirmed: sub.confirmedAt !== null,
    };
  }

  async subscribe(dto: SubscribeDto): Promise<SubscribeResult> {
    const org = await this.prisma.organization.findUnique({
      where: { slug: dto.slug },
      select: { id: true, name: true },
    });

    if (!org) {
      throw new NotFoundException('Workspace not found');
    }

    const existing = await this.prisma.subscriber.findUnique({
      where: {
        email_orgId: {
          email: dto.email,
          orgId: org.id,
        },
      },
    });

    if (existing) {
      if (!existing.confirmedAt) {
        await this.sendConfirmationEmail(
          existing.email,
          existing.unsubscribeToken,
          org.name,
          dto.slug,
        );
        return {
          message: 'Confirmation email resent. Please check your inbox.',
          alreadySubscribed: true,
        };
      }

      return {
        message: 'You are already subscribed to this changelog.',
        alreadySubscribed: true,
      };
    }

    const unsubscribeToken = randomBytes(32).toString('hex');

    const subscriber = await this.prisma.subscriber.create({
      data: {
        email: dto.email,
        orgId: org.id,
        unsubscribeToken,
      },
    });

    await this.sendConfirmationEmail(
      subscriber.email,
      subscriber.unsubscribeToken,
      org.name,
      dto.slug,
    );

    return {
      message: 'Please check your email to confirm your subscription.',
      alreadySubscribed: false,
    };
  }

  async confirmEmail(token: string): Promise<{ message: string }> {
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      throw new NotFoundException('Invalid confirmation token');
    }

    if (subscriber.confirmedAt) {
      return { message: 'Email already confirmed.' };
    }

    await this.prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { confirmedAt: new Date() },
    });

    return { message: 'Email confirmed! You will receive changelog updates.' };
  }

  async unsubscribe(token: string): Promise<{ message: string }> {
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      throw new NotFoundException('Invalid unsubscribe token');
    }

    await this.prisma.subscriber.delete({
      where: { id: subscriber.id },
    });

    return { message: 'You have been unsubscribed successfully.' };
  }

  async findAll(orgId: string): Promise<SubscriberItem[]> {
    const subscribers = await this.prisma.subscriber.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        confirmedAt: true,
        createdAt: true,
      },
    });

    return subscribers.map((s) => this.format(s));
  }

  async remove(
    id: string,
    orgId: string,
  ): Promise<{ message: string }> {
    const subscriber = await this.prisma.subscriber.findFirst({
      where: { id, orgId },
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    await this.prisma.subscriber.delete({ where: { id } });

    return { message: 'Subscriber removed successfully' };
  }

  async notifySubscribers(
    orgId: string,
    entryId: string,
  ): Promise<{ sent: number }> {
    await this.subscription.requireFeature(orgId, 'emailNotifications');

    const entry = await this.prisma.changelogEntry.findFirst({
      where: { id: entryId, project: { orgId } },
      select: {
        id: true,
        title: true,
        content: true,
        version: true,
        publishedAt: true,
        project: {
          select: {
            organization: {
              select: {
                name: true,
                slug: true,
                logo: true,
                brandColor: true,
              },
            },
          },
        },
      },
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    const subscribers = await this.prisma.subscriber.findMany({
      where: {
        orgId,
        confirmedAt: { not: null },
      },
      select: {
        email: true,
        unsubscribeToken: true,
      },
    });

    if (subscribers.length === 0) {
      return { sent: 0 };
    }

    const org = entry.project.organization;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const batchSize = 10;
    let sent = 0;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map((sub) =>
          this.sendChangelogEmail({
            to: sub.email,
            unsubscribeToken: sub.unsubscribeToken,
            orgName: org.name,
            orgSlug: org.slug,
            orgLogo: org.logo,
            brandColor: org.brandColor,
            entryTitle: entry.title,
            entryVersion: entry.version,
            entryContent: entry.content,
            appUrl,
          }).then(() => { sent++; }),
        ),
      );
    }

    return { sent };
  }

  private async sendConfirmationEmail(
    to: string,
    token: string,
    orgName: string,
    orgSlug: string,
  ): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const confirmUrl = `${appUrl}/api/confirm-email?token=${token}`;

    await this.sendEmail({
      to,
      subject: `Confirm your subscription to ${orgName} changelog`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #111827; font-size: 20px; margin-bottom: 8px;">
            Confirm your subscription
          </h2>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            You requested to subscribe to <strong>${orgName}</strong> changelog updates.
            Click the button below to confirm.
          </p>
          <a
            href="${confirmUrl}"
            style="display: inline-block; margin: 24px 0; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;"
          >
            Confirm subscription
          </a>
          <p style="color: #9ca3af; font-size: 12px;">
            If you didn't request this, you can safely ignore this email.
          </p>
          <p style="color: #9ca3af; font-size: 12px;">
            Powered by <a href="${appUrl}" style="color: #2563eb;">Parallel</a>
          </p>
        </div>
      `,
    });
  }

  private async sendChangelogEmail(params: {
    to: string;
    unsubscribeToken: string;
    orgName: string;
    orgSlug: string;
    orgLogo: string | null;
    brandColor: string;
    entryTitle: string;
    entryVersion: string | null;
    entryContent: string;
    appUrl: string;
  }): Promise<void> {
    const {
      to, unsubscribeToken, orgName, orgSlug,
      brandColor, entryTitle, entryVersion,
      entryContent, appUrl,
    } = params;

    const changelogUrl = `${appUrl}/${orgSlug}/changelog`;
    const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${unsubscribeToken}`;

    const contentHtml = entryContent
      .replace(/^## (.+)$/gm, '<h3 style="color:#111827;font-size:16px;margin:20px 0 8px;">$1</h3>')
      .replace(/^- (.+)$/gm, '<li style="color:#374151;font-size:14px;margin:4px 0;">$1</li>')
      .replace(/\n\n/g, '</p><p style="color:#374151;font-size:14px;line-height:1.6;">')
      .replace(/\n/g, '<br/>');

    await this.sendEmail({
      to,
      subject: `${entryVersion ? `[${entryVersion}] ` : ''}${entryTitle} — ${orgName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 0;">

          <!-- Header -->
          <div style="background: ${brandColor}; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <span style="color: white; font-size: 18px; font-weight: 700;">${orgName}</span>
            ${entryVersion ? `<span style="color: rgba(255,255,255,0.7); font-size: 13px; margin-left: 8px;">${entryVersion}</span>` : ''}
          </div>

          <!-- Content -->
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #111827; font-size: 22px; font-weight: 700; margin: 0 0 16px;">
              ${entryTitle}
            </h2>
            <div style="color: #374151; font-size: 14px; line-height: 1.7;">
              <p style="margin: 0 0 16px;">${contentHtml}</p>
            </div>

            <!-- CTA -->
            <a
              href="${changelogUrl}"
              style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: ${brandColor}; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;"
            >
              View full changelog →
            </a>
          </div>

          <!-- Footer -->
          <div style="padding: 16px 32px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              You're receiving this because you subscribed to ${orgName} changelog updates.
              <a href="${unsubscribeUrl}" style="color: #6b7280;">Unsubscribe</a>
            </p>
            <p style="color: #d1d5db; font-size: 11px; margin: 8px 0 0;">
              Powered by <a href="${appUrl}" style="color: #9ca3af;">Parallel</a>
            </p>
          </div>
        </div>
      `,
    });
  }

  private async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('[SubscribersService] RESEND_API_KEY not set — skipping email');
      return;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? 'Parallel <dinalmiyani@gmail.com>',
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('[SubscribersService] Email send failed:', error);
    }
  }
}