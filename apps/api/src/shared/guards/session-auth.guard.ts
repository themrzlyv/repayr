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
import { generateCsrfSecret } from '../utils/csrf.util';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.session.userId || !request.session.isAuthenticated) {
      throw new UnauthorizedException('Not authenticated');
    }

    const session = await this.prismaService.session.findUnique({
      where: { id: request.sessionID },
    });

    if (!session || !session.isAuthenticated) {
      throw new NotFoundException('Session not found');
    }

    request.session.expire = session.expire;
    request.session.isAuthenticated = session.isAuthenticated;
    request.session.userId = session.userId;
    request.session.role = session.role;
    request.session.metadata = session.metadata as SessionMetaData;
    request.session.csrfSecret = session.csrfSecret;

    return true;
  }
}
