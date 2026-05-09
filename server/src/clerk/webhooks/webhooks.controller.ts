import { Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { RawBodyRequest } from '@nestjs/common';
import { Webhook } from 'svix';
import { PrismaService } from 'src/prisma/prisma.service';
import { createClerkClient } from '@clerk/backend';

@Controller('webhooks')
export class WebhooksController {
  private clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  constructor(private prisma: PrismaService) { }

  @Post('clerk')
  async handleClerk(
    @Req() req: Request,
    @Res() res: Response
  ) {
    const rawReq = req as RawBodyRequest<Request>;
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      return res.status(500).json({ error: 'Missing Webhook Secret' });
    }

    const svix_id = req.headers['svix-id'] as string;
    const svix_timestamp = req.headers['svix-timestamp'] as string;
    const svix_signature = req.headers['svix-signature'] as string;

    const payload = rawReq.rawBody?.toString() ?? '';
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: any;

    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Webhook verification failed', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { type, data } = evt;

    switch (type) {
      case 'user.created':
      case 'user.updated':
        await this.prisma.user.upsert({
          where: { id: data.id },
          update: {
            email: data.email_addresses[0].email_address,
            name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
            image: data.image_url,
          },
          create: {
            id: data.id,
            email: data.email_addresses[0].email_address,
            name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
            image: data.image_url,
          },
        });
        break;

      case 'organization.created':
      case 'organization.updated':
        await this.prisma.organization.upsert({
          where: { id: data.id },
          update: { name: data.name, slug: data.slug, logo: data.logo_url },
          create: { id: data.id, name: data.name, slug: data.slug, logo: data.logo_url },
        });
        break;

      case 'organizationMembership.created':
      case 'organizationMembership.updated':
        const mUserId = data.public_user_data.user_id;
        const mOrgId = data.organization.id;
        await this.prisma.organization.upsert({
          where: { id: mOrgId },
          update: {},
          create: {
            id: mOrgId,
            name: data.organization.name,
            slug: data.organization.slug
          },
        });

        await this.prisma.member.upsert({
          where: { userId_orgId: { userId: mUserId, orgId: mOrgId } },
          update: { role: data.role === 'org:admin' ? 'ADMIN' : 'MEMBER' },
          create: {
            userId: mUserId,
            orgId: mOrgId,
            role: data.role === 'org:admin' ? 'ADMIN' : 'MEMBER',
          },
        });
        break;

      case 'organizationMembership.deleted':
        try {
          await this.prisma.member.delete({
            where: { userId_orgId: { userId: data.public_user_data.user_id, orgId: data.organization.id } },
          });
        } catch (e) {
          console.log('Member already deleted or not found');
        }
        break;

      case 'user.deleted':
        try {
          await this.prisma.user.update({
            where: { id: data.id },
            data: { name: 'Deleted User', email: `deleted-${data.id}@deleted.invalid` },
          });
        } catch (e) {
          console.log(e, 'error')
        }
        break;

      case 'organization.deleted':
        await this.prisma.organization.delete({
          where: { id: data.id },
        });
        break;
    }

    return res.status(200).json({ success: true });
  }
}