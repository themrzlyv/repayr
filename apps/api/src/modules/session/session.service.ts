import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';

@Injectable()
export class SessionService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getUserSessions(userId: string) {
    const sessions = await this.prismaService.session.findMany({
      where: { userId },
    });

    return {
      sessions,
    };
  }

  public async deleteSession(id: string) {
    await this.prismaService.session.delete({
      where: { id },
    });

    return true;
  }
}
