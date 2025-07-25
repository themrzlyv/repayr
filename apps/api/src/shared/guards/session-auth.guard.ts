import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionMetaData } from '../types/session-metadata.types';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.session.user.id || !request.session.isAuthenticated) {
      throw new UnauthorizedException('Not authenticated');
    }

    const session = await this.prismaService.session.findUnique({
      where: { id: request.sessionID },
      include: { user: true },
    });

    if (!session || !session.isAuthenticated) {
      throw new NotFoundException('Session not found');
    }

    request.session.expire = session.expire;
    request.session.isAuthenticated = session.isAuthenticated;
    request.session.user = session.user;
    request.session.metadata = session.metadata as SessionMetaData;
    request.session.csrfSecret = session.csrfSecret;

    return true;
  }
}
