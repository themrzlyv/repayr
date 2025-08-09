import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { NotificationType, Status } from '@/prisma/generated';
import { BASE_TRANSACTION_SELECT } from '@/src/shared/data/prisma-selects';
import { EVENT } from '@/src/shared/domain/events/event-types';
import { TransactionStatusChangedEvent } from '@/src/shared/domain/events/domain-events';

@Injectable()
export class TransactionStatusChangedListener {
  private readonly logger = new Logger(TransactionStatusChangedListener.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent(EVENT.TRANSACTION_STATUS_CHANGED, { async: true })
  async handle(evt: TransactionStatusChangedEvent) {
    const { mainTransactionId, recipientId, newStatus } = evt.payload;
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: mainTransactionId },
        select: BASE_TRANSACTION_SELECT,
      });
      if (!transaction) return;

      const fullName =
        transaction.name ??
        [transaction?.owner?.firstName, transaction?.owner?.lastName]
          .filter(Boolean)
          .join(' ');

      const notifType =
        newStatus === Status.ACCEPTED
          ? NotificationType.TRANSACTION_ACCEPTED
          : NotificationType.TRANSACTION_REJECTED;

      const notificationMessage =
        `${fullName} changed the status of a transaction to ` +
        `${newStatus.toLowerCase()} for you. (ID: ${transaction.id}).`;

      await this.prisma.notification.create({
        data: {
          userId: recipientId,
          actorId: evt.actorId,
          type: notifType,
          transactionId: transaction.id,
          data: {
            name: fullName,
            avatar: transaction.owner?.avatar,
            type: transaction.type,
            dueDate: transaction.dueDate,
            amount: transaction.amount,
            message: notificationMessage,
          },
        },
      });
    } catch (e) {
      this.logger.error('transaction.status.changed listener failed', e as any);
    }
  }
}
