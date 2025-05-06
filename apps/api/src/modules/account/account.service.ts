import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { Session } from '@/prisma/generated';

@Injectable()
export class AccountService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async me(session: Session) {
    const user = await this.prismaService.user.findUnique({
      where: { id: session.userId },
    });

    return user;
  }
}
