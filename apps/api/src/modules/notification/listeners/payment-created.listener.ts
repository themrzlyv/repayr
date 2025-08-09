import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { NotificationType } from '@/prisma/generated';
import {
  BASE_AMOUNT_SELECT,
  BASE_TRANSACTION_SELECT,
} from '@/src/shared/data/prisma-selects';
import { PaymentCreatedEvent } from '@/src/shared/domain/events/domain-events';

@Injectable()
export class PaymentCreatedListener {
  private readonly logger = new Logger(PaymentCreatedListener.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('payment.created', { async: true })
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

      const message = `${ownerFullName} added a payment of ${payment.amount.value} ${payment.amount.currency} to the ${transaction.type.toLowerCase()} transaction (ID: ${transaction.id}).`;

      await this.prisma.notification.create({
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
            dueDate: transaction.dueDate,
            amount: transaction.amount,
            message,
          },
        },
      });
    } catch (e) {
      this.logger.error('payment.created listener failed', e as any);
    }
  }
}
