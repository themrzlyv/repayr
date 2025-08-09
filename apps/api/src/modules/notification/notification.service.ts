import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async list(userId: string, page: string, limit: string) {
    const limitValue = parseInt(limit) || 5;
    const pageValue = parseInt(page) || 1;

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.notification.findMany({
        where: { userId },
        orderBy: [{ readAt: 'desc' }, { createdAt: 'desc' }],
        skip: (pageValue - 1) * limitValue,
        take: limitValue,
      }),
      this.prismaService.notification.count({ where: { userId } }),
    ]);
    return {
      notifications: items,
      pagination: {
        total,
        page,
        pageCount: Math.ceil(total / limitValue),
      },
    };
  }

  async markRead(userId: string, id: string) {
    await this.prismaService.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }

  async markAllRead(userId: string) {
    await this.prismaService.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }
}
