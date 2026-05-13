import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: string;
        orgId: string;
      };
    }
  }
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload: any = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
        authorizedParties: [
          process.env.FRONTEND_URL ?? 'http://localhost:3000',
        ],
      });

      const userId = payload.sub;
      const orgId  = payload?.o?.id as string | undefined;

      if (!userId) throw new UnauthorizedException('Invalid token — no userId');
      if (!orgId)  throw new UnauthorizedException('No organization selected');

      request.auth = { userId, orgId };
      return true;
    } catch (err) {
      console.error('[ClerkAuthGuard] Token verification failed:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}