import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { REFRESH_TOKEN } from '@/src/shared/data/constants';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verilen token'a ait session'u getirir.
   */
  async getSessionByToken(token: string) {
    return this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  /**
   * Yeni session yaratır.
   */
  async createSession(data: {
    token: string;
    csrfSecret: string;
    fingerprint: string;
    expire: Date;
    userId: string;
  }) {
    return this.prisma.session.create({
      data: {
        token: data.token,
        csrfSecret: data.csrfSecret,
        fingerprint: data.fingerprint,
        expire: data.expire,
        user: { connect: { id: data.userId } },
      },
    });
  }

  /**
   * Mevcut session token'ını günceller (token rotation).
   */
  async updateSessionToken(
    oldToken: string,
    newToken: string,
    newCsrf: string,
  ) {
    return this.prisma.session.update({
      where: { token: oldToken },
      data: {
        token: newToken,
        csrfSecret: newCsrf,
      },
    });
  }

  /**
   * Session siler.
   */
  async deleteSession(token: string) {
    return this.prisma.session.delete({ where: { token } });
  }

  /**
   * Kullanıcının tüm sessionlarını siler (örn. fingerprint mismatch).
   */
  async revokeAllSessionsForUser(userId: string) {
    return this.prisma.session.deleteMany({
      where: { user: { id: userId } },
    });
  }

  /**
   * Session doğrulaması: CSRF, fingerprint ve expiration.
   */
  async validateSession({
    token,
    csrfSecret,
    fingerprint,
  }: {
    token: string;
    csrfSecret: string;
    fingerprint: string;
  }) {
    const session = await this.getSessionByToken(token);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.fingerprint !== fingerprint) {
      await this.revokeAllSessionsForUser(session.user.id);
      throw new UnauthorizedException('Fingerprint mismatch. Session revoked.');
    }

    if (session.csrfSecret !== csrfSecret) {
      throw new UnauthorizedException('Invalid CSRF token');
    }

    if (session.expire < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    return session;
  }
}
