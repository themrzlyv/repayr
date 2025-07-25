import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { Session } from 'express-session';
import { UpdateAccountInput } from './inputs/update-account.input';

@Injectable()
export class AccountService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async me(session: Session) {
    const user = await this.prismaService.user.findUnique({
      where: { id: session.user.id },
      include: {
        debts: {
          include: {
            amount: true,
            category: {
              select: {
                id: true,
                title: true,
                icon: true,
                type: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        lendings: {
          include: {
            amount: true,
            category: {
              select: {
                id: true,
                title: true,
                icon: true,
                type: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return user;
  }

  public async searchAccount(userId: string, tagName: string) {
    const users = await this.prismaService.user.findMany({
      where: {
        tagName: {
          startsWith: tagName,
          mode: 'insensitive',
        },
        NOT: {
          id: userId,
        },
      },
      take: 5,
      select: {
        id: true,
        tagName: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
      },
    });

    return users;
  }

  public async updateAccount(session: Session, input: UpdateAccountInput) {
    await this.prismaService.user.update({
      where: { id: session.user.id },
      data: { currency: input.currency },
    });

    return true;
  }
}
