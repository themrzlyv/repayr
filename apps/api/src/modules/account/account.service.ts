import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Injectable()
export class AccountService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async me(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
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

  public async updateAccount(userId: string, input: UpdateAccountDto) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { currency: input.currency },
    });

    return true;
  }
}
