import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { NotificationType } from '@/prisma/generated';
import { BASE_TRANSACTION_SELECT } from '@/src/shared/data/prisma-selects';
import { TransactionCreatedEvent } from '@/src/shared/domain/events/domain-events';
import { EVENT } from '@/src/shared/domain/events/event-types';
import { NotificationEventTypeEnum } from '../types/notification-event-type.enum';

@Injectable()
export class TransactionCreatedListener {
  private readonly logger = new Logger(TransactionCreatedListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  @OnEvent(EVENT.TRANSACTION_CREATED, { async: true })
  async handle(evt: TransactionCreatedEvent) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: evt.payload.mainTransactionId },
        select: {
          ...BASE_TRANSACTION_SELECT,
          linkedTransaction: {
            select: {
              ...BASE_TRANSACTION_SELECT,
              linkedTransaction: undefined,
            }
          }
        },
      });

      const fullName =
        transaction.name ??
        [transaction?.owner?.firstName, transaction?.owner?.lastName]
          .filter(Boolean)
          .join(' ');
          

      const notif = await this.prisma.notification.create({
        data: {
          userId: evt.payload.approverId,
          actorId: evt.actorId,
          type: NotificationType.TRANSACTION_CREATED,
          transactionId: evt.payload.mainTransactionId,
          data: transaction
            ? {
                name: fullName,
                avatar: transaction.owner?.avatar,
                type: transaction.linkedTransaction.type,
                transactionStatus: transaction.status,
              }
            : undefined,
        },
      });

      this.events.emit(NotificationEventTypeEnum.NOTIFICATION_CREATED, {
        userId: evt.payload.approverId,
        notification: notif,
      });

      const unread = await this.prisma.notification.count({
        where: { userId: evt.payload.approverId, readAt: null },
      });

      this.events.emit(NotificationEventTypeEnum.NOTIFICATION_UNREAD, {
        userId: evt.payload.approverId,
        count: unread,
      });
    } catch (e) {
      this.logger.error('transaction.created listener failed', e as any);
    }
  }
}
