import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEventTypeEnum } from './types/notification-event-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

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

  public async unread(userId: string) {
    const count = await this.prismaService.notification.count({
      where: { userId, readAt: null },
    });
    return { count };
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

  async create(
    data: Parameters<typeof this.prismaService.notification.create>[0]['data'],
  ) {
    const notification = await this.prismaService.notification.create({ data });
    this.events.emit(NotificationEventTypeEnum.NOTIFICATION_CREATED, {
      userId: notification.userId,
      notification,
    });
    return notification;
  }
}
