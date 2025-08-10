import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';
import {
  CategoryType,
  Currency,
  Prisma,
  Status,
  TransactionType,
} from '@/prisma/generated';
import { BASE_TRANSACTION_SELECT } from '@/src/shared/data/prisma-selects';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT } from '@/src/shared/domain/events/event-types';
import { BaseEvent } from '@/src/shared/domain/events/base-event';
import { DebtService } from '../../debt/debt.service';
import { CategoryService } from '../../category/category.service';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../dtos/update-transaction-status.dto';
import { isFullyPaid } from '../domain/is-fully-paid';

@Injectable()
export class TransactionMutationService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly debtService: DebtService,
    private readonly categoryService: CategoryService,
    private readonly events: EventEmitter2,
  ) {}

  public async createTransaction(
    user: RequestUserEntity,
    input: CreateTransactionDto,
  ) {
    const {
      name,
      counterpartyId,
      description,
      amount,
      type,
      categoryId,
      dueDate,
    } = input;

    const mirrorType =
      type === TransactionType.DEBT
        ? TransactionType.LENDING
        : TransactionType.DEBT;

    const { category } =
      await this.categoryService.getCategoryDetails(categoryId);

    if (category.type === CategoryType.CUSTOM && category.userId !== user.id) {
      throw new ForbiddenException('Category does not belong to you');
    }

    const counterpartyCategoryRelation =
      category.type === CategoryType.SYSTEM
        ? { connect: { id: category.id } }
        : {
            connectOrCreate: {
              where: {
                userId_title: {
                  userId: counterpartyId,
                  title: category.title,
                },
              },
              create: {
                title: category.title,
                icon: category.icon,
                type: CategoryType.CUSTOM,
                user: { connect: { id: counterpartyId } },
              },
            },
          };

    await this.prismaService.$transaction(async (tx) => {
      const mainTransaction = await tx.transaction.create({
        data: {
          name,
          description,
          category: { connect: { id: categoryId } },
          owner: { connect: { id: user.id } },
          type,
          dueDate,
          initiator: { connect: { id: user.id } },
          approver: { connect: { id: counterpartyId } },
          amount: { create: { ...amount } },
          ...(type === TransactionType.DEBT && {
            debt: { create: { borrowerId: user.id, counterpartyId } },
          }),
          ...(type === TransactionType.LENDING && {
            lending: { create: { lenderId: user.id, counterpartyId } },
          }),
        },
      });

      const linkedTransaction = await tx.transaction.create({
        data: {
          name,
          description,
          type: mirrorType,
          dueDate,
          initiator: { connect: { id: user.id } },
          approver: { connect: { id: counterpartyId } },
          linkedTransaction: { connect: { id: mainTransaction.id } },
          category: counterpartyCategoryRelation,
          owner: { connect: { id: counterpartyId } },
          amount: { create: { ...amount } },
          ...(mirrorType === TransactionType.DEBT && {
            debt: {
              create: { borrowerId: counterpartyId, counterpartyId: user.id },
            },
          }),
          ...(mirrorType === TransactionType.LENDING && {
            lending: {
              create: { lenderId: counterpartyId, counterpartyId: user.id },
            },
          }),
        },
      });

      await tx.transaction.update({
        where: { id: mainTransaction.id },
        data: { linkedTransaction: { connect: { id: linkedTransaction.id } } },
      });

      this.events.emit(
        EVENT.TRANSACTION_CREATED,
        new BaseEvent({
          name: EVENT.TRANSACTION_CREATED,
          actorId: user.id,
          payload: {
            mainTransactionId: mainTransaction.id,
            linkedTransactionId: linkedTransaction.id,
            approverId: counterpartyId,
          },
        }),
      );
    });

    return true;
  }

  public async updateTransactionStatus(
    user: RequestUserEntity,
    input: UpdateTransactionStatusDto,
  ) {
    const { status, transactionId } = input;

    const transaction = await this.prismaService.transaction.findUnique({
      where: { id: transactionId },
      include: { linkedTransaction: { select: { id: true } } },
    });

    if (transaction.approverId !== user.id) {
      throw new ForbiddenException('Not allowed to modify this transaction');
    }

    if (transaction.status !== 'PENDING') {
      throw new BadRequestException('Transaction is already resolved');
    }

    await this.prismaService.$transaction([
      this.prismaService.transaction.update({
        where: { id: transaction.id },
        data: { status },
      }),
      this.prismaService.transaction.update({
        where: { id: transaction.linkedTransactionId },
        data: { status },
      }),
    ]);

    this.events.emit(
      EVENT.TRANSACTION_STATUS_CHANGED,
      new BaseEvent({
        name: EVENT.TRANSACTION_STATUS_CHANGED,
        actorId: user.id,
        payload: {
          mainTransactionId: transaction.id,
          linkedTransactionId: transaction.linkedTransactionId!,
          recipientId: transaction.initiatorId,
          newStatus: status,
        },
      }),
    );
  }

  public async updateStatusAfterPayment(id: string, payerId: string) {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id },
      select: {
        ...BASE_TRANSACTION_SELECT,
        approverId: true,
        initiatorId: true,
        linkedTransactionId: true,
      },
    });

    const totalPaid = await this.debtService.computeTotalPaid(
      transaction.debt,
      transaction.amount.currency,
    );

    const fullyPaid = isFullyPaid(totalPaid, transaction.amount.value);

    if (!fullyPaid || transaction.status === Status.PAID) {
      return { changedToPaid: false };
    }

    await this.prismaService.transaction.update({
      where: { id },
      data: {
        status: Status.PAID,
        linkedTransaction: { update: { status: Status.PAID } },
      },
    });

    const recipientId =
      payerId === transaction.initiatorId
        ? transaction.approverId
        : transaction.initiatorId;

    return {
      changedToPaid: true,
      recipientId,
      linkedTransactionId: transaction.linkedTransactionId!,
    };
  }
}
