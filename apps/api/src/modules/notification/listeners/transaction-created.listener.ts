import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { NotificationType } from '@/prisma/generated';
import { BASE_TRANSACTION_SELECT } from '@/src/shared/data/prisma-selects';
import { TransactionCreatedEvent } from '@/src/shared/domain/events/domain-events';

@Injectable()
export class TransactionCreatedListener {
  private readonly logger = new Logger(TransactionCreatedListener.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('transaction.created', { async: true })
  async handle(evt: TransactionCreatedEvent) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: evt.payload.mainTransactionId },
        select: BASE_TRANSACTION_SELECT,
      });

      const fullName =
        transaction.name ??
        [transaction?.owner?.firstName, transaction?.owner?.lastName]
          .filter(Boolean)
          .join(' ');

      const notificationMessage = `${fullName} has created a new ${transaction.type.toLowerCase()} transaction for you. (ID: ${transaction.id}).`;

      await this.prisma.notification.create({
        data: {
          userId: evt.payload.approverId,
          actorId: evt.actorId,
          type: NotificationType.TRANSACTION_CREATED,
          transactionId: evt.payload.mainTransactionId,
          data: transaction
            ? {
                name: fullName,
                avatar: transaction.owner?.avatar,
                type: transaction.type,
                dueDate: transaction.dueDate,
                amount: transaction.amount,
                message: notificationMessage,
              }
            : undefined,
        },
      });
    } catch (e) {
      this.logger.error('transaction.created listener failed', e as any);
    }
  }
}
