import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { NotificationType } from '@/prisma/generated';
import {
  BASE_AMOUNT_SELECT,
  BASE_TRANSACTION_SELECT,
} from '@/src/shared/data/prisma-selects';
import { PaymentCreatedEvent } from '@/src/shared/domain/events/domain-events';
import { EVENT } from '@/src/shared/domain/events/event-types';
import { NotificationEventTypeEnum } from '../types/notification-event-type.enum';

@Injectable()
export class PaymentCreatedListener {
  private readonly logger = new Logger(PaymentCreatedListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  @OnEvent(EVENT.PAYMENT_CREATED, { async: true })
  async handle(evt: PaymentCreatedEvent) {
    const { paymentId } = evt.payload;
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
        select: {
          id: true,
          createdAt: true,
          userId: true,
          amount: { select: BASE_AMOUNT_SELECT },
          debt: {
            select: {
              id: true,
              borrowerId: true,
              counterpartyId: true,
              transaction: {
                select: BASE_TRANSACTION_SELECT,
              },
            },
          },
        },
      });

      if (!payment) return;

      const payerId = payment.userId;
      const { borrowerId, counterpartyId, transaction } = payment.debt;

      const recipientId = payerId === borrowerId ? counterpartyId : borrowerId;

      if (!recipientId || recipientId === payerId) return;

      const ownerFullName =
        [transaction.owner?.firstName, transaction.owner?.lastName]
          .filter(Boolean)
          .join(' ') || 'Someone';

      const notif = await this.prisma.notification.create({
        data: {
          userId: recipientId,
          actorId: payerId,
          type: NotificationType.PAYMENT_ADDED,
          transactionId: transaction.id,
          paymentId: payment.id,
          data: {
            name: ownerFullName,
            avatar: transaction.owner?.avatar,
            type: transaction.type,
            transactionStatus: transaction.status,
            payment,
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
      this.logger.error('payment.created listener failed', e as any);
    }
  }
}
