import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { NotificationType, Status } from '@/prisma/generated';
import { BASE_TRANSACTION_SELECT } from '@/src/shared/data/prisma-selects';
import { EVENT } from '@/src/shared/domain/events/event-types';
import { TransactionStatusChangedEvent } from '@/src/shared/domain/events/domain-events';
import { NotificationEventTypeEnum } from '../types/notification-event-type.enum';

@Injectable()
export class TransactionStatusChangedListener {
  private readonly logger = new Logger(TransactionStatusChangedListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  @OnEvent(EVENT.TRANSACTION_STATUS_CHANGED, { async: true })
  async handle(evt: TransactionStatusChangedEvent) {
    const { mainTransactionId, recipientId, newStatus } = evt.payload;
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: mainTransactionId },
        select: {
          ...BASE_TRANSACTION_SELECT,
          linkedTransaction: {
            select: {
              ...BASE_TRANSACTION_SELECT,
              linkedTransaction: undefined,
            },
          },
        },
      });
      if (!transaction) return;

      const fullName =
        transaction.name ??
        [transaction?.owner?.firstName, transaction?.owner?.lastName]
          .filter(Boolean)
          .join(' ');

      const notifType =
        (
          {
            [Status.ACCEPTED]: NotificationType.TRANSACTION_ACCEPTED,
            [Status.REJECTED]: NotificationType.TRANSACTION_REJECTED,
            [Status.PAID]: NotificationType.TRANSACTION_PAID,
          } as Partial<Record<Status, NotificationType>>
        )[newStatus] ?? null;

      const notif = await this.prisma.notification.create({
        data: {
          userId: recipientId,
          actorId: evt.actorId,
          type: notifType,
          transactionId: transaction.id,
          data: {
            name: fullName,
            avatar: transaction.owner?.avatar,
            type: transaction.linkedTransaction.type,
            transactionStatus: newStatus,
          },
        },
      });

      this.events.emit(NotificationEventTypeEnum.NOTIFICATION_CREATED, {
        userId: recipientId,
        notification: notif,
      });

      const unread = await this.prisma.notification.count({
        where: { userId: recipientId, readAt: null },
      });
      this.events.emit(NotificationEventTypeEnum.NOTIFICATION_UNREAD, {
        userId: recipientId,
        count: unread,
      });
    } catch (e) {
      this.logger.error('transaction.status.changed listener failed', e as any);
    }
  }
}
