import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as session from 'express-session';
// import * as pgSession from 'connect-pg-simple';
// import { Pool } from 'pg';
// import { randomUUID } from 'crypto';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { PrismaSessionStore } from '@/src/core/prisma/prisma-session-store';
import { SessionMiddleware } from '@/src/shared/middlewares/session-middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SessionController],
  providers: [SessionService, PrismaSessionStore, SessionMiddleware],
  exports: [SessionService],
})
export class SessionModule {}
