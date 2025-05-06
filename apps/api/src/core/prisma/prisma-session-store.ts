import * as session from 'express-session';
import { PrismaService } from './prisma.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

const Store = session.Store;

@Injectable()
export class PrismaSessionStore extends Store implements OnModuleInit {
  private prisma: PrismaService;

  constructor(private readonly moduleRef: ModuleRef) {
    super();
  }

  async onModuleInit() {
    this.prisma = this.moduleRef.get(PrismaService, { strict: false });
  }

  async get(
    id: string,
    callback: (err: any, session?: session.SessionData | null) => void,
  ) {
    try {
      const dbSession = await this.prisma.session.findUnique({
        where: { id },
      });

      if (!dbSession || dbSession.expire < new Date()) {
        return callback(null, null);
      }

      const sessionData = {
        cookie: {
          maxAge: dbSession.expire.getTime() - Date.now(),
        },
        isAuthenticated: dbSession.isAuthenticated,
        userId: dbSession.userId,
        role: dbSession.role,
        metadata: dbSession.metadata,
        csrfSecret: dbSession.csrfSecret,
      } as any;

      callback(null, sessionData);
    } catch (err) {
      callback(err);
    }
  }

  async set(
    id: string,
    sessionData: session.SessionData,
    callback: (err?: any) => void,
  ) {
    try {
      const expires = new Date(
        Date.now() + (sessionData.cookie?.maxAge || 86400000),
      );

      await this.prisma.session.upsert({
        where: { id },
        update: {
          isAuthenticated: (sessionData as any).isAuthenticated ?? false,
          userId: (sessionData as any).userId ?? null,
          expire: expires,
          role: (sessionData as any).role ?? null,
          metadata: (sessionData as any).metadata ?? null,
          csrfSecret: (sessionData as any).csrfSecret ?? undefined,
        },
        create: {
          id,
          isAuthenticated: (sessionData as any).isAuthenticated ?? false,
          userId: (sessionData as any).userId ?? null,
          expire: expires,
          role: (sessionData as any).role ?? null,
          metadata: (sessionData as any).metadata ?? null,
          csrfSecret: (sessionData as any).csrfSecret ?? undefined,
        },
      });

      callback();
    } catch (err) {
      callback(err);
    }
  }

  async destroy(id: string, callback: (err?: any) => void) {
    try {
      await this.prisma.session.delete({ where: { id } }).catch(() => null);

      callback();
    } catch (err) {
      callback(err);
    }
  }
}
