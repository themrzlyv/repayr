import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PrismaSessionStore } from '../../core/prisma/prisma-session-store';
import { isDev } from '../utils/is-dev.util';
import { randomUUID } from 'crypto';

@Injectable()
export class SessionMiddleware {
  constructor(
    private configService: ConfigService,
    private prismaSessionStore: PrismaSessionStore,
  ) {}

  get middleware() {
    const isDevelopment = isDev(this.configService);

    return session({
      genid: () => randomUUID(),
      secret: this.configService.get('SESSION_SECRET') || 'my-secret-key',
      resave: false,
      saveUninitialized: false,
      store: this.prismaSessionStore,
      cookie: {
        httpOnly: true,
        secure: !isDevelopment,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: isDevelopment ? 'lax' : 'strict',
        path: '/',
      },
      name: 'repayr.sid',
      rolling: true,
    });
  }
}
