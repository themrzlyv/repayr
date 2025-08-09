import { PrismaService } from '@/src/core/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ExchangeService } from '../exchange/exchange.service';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import {
  CategoryType,
  Currency,
  Prisma,
  Status,
  TransactionType,
} from '@/prisma/generated';
import { UpdateTransactionStatusDto } from './dtos/update-transaction-status.dto';
import { GetTransactionsDto } from './dtos/get-transactions.dto';
import {
  BASE_CATEGORY_SELECT,
  BASE_TRANSACTION_SELECT,
} from '@/src/shared/data/prisma-selects';
import { DebtService } from '../debt/debt.service';
import { CategoryService } from '../category/category.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT } from '@/src/shared/domain/events/event-types';
import { BaseEvent } from '@/src/shared/domain/events/base-event';

@Injectable()
export class TransactionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly debtService: DebtService,
    private readonly categoryService: CategoryService,
    private readonly exchangeService: ExchangeService,
    private readonly events: EventEmitter2,
  ) {}

  private readonly baseTransactionSelect = {
    ...BASE_TRANSACTION_SELECT,
  } satisfies Prisma.TransactionSelect;

  private get transactionSelectWithLink(): Prisma.TransactionSelect {
    return {
      ...this.baseTransactionSelect,
      linkedTransaction: {
        select: {
          ...this.baseTransactionSelect,
          linkedTransaction: undefined,
        },
      },
    };
  }

  public async getUserTransactions(userId: string, query: GetTransactionsDto) {
    const { page, limit, sortBy, order, status, type, searchQuery } = query;

    const where: Prisma.TransactionWhereInput = {
      OR: [
        { ownerId: userId },
        { debt: { borrowerId: userId } },
        { lending: { lenderId: userId } },
      ],
      ...(type && { type }),
      ...(status && { status }),
    };

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.transaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        select: {
          ...this.baseTransactionSelect,
          linkedTransaction: {
            select: {
              ...this.baseTransactionSelect,
              linkedTransaction: undefined,
            },
          },
        },
      }),
      this.prismaService.transaction.count({ where }),
    ]);

    const transactions = await Promise.all(
      items.map(async (tx) => {
        if (type === TransactionType.LENDING) {
          const { linkedTransaction, ...rest } = tx;

          const counterpartyTotalPayments =
            await this.addTotals(linkedTransaction);

          return {
            ...rest,
            totalPayments: counterpartyTotalPayments.totalPayments,
          };
        } else {
          return await this.addTotals(tx);
        }
      }),
    );

    return {
      transactions,
      pagination: {
        total,
        page,
        pageCount: Math.ceil(total / limit),
      },
    };
  }

  public async getTransactionById(
    user: RequestUserEntity,
    transactionId: string,
  ) {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id: transactionId },
      select: {
        ...this.baseTransactionSelect,
        linkedTransaction: {
          select: {
            ...this.baseTransactionSelect,
            linkedTransaction: undefined,
          },
        },
      },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    const canSee =
      transaction.owner.id === user.id ||
      transaction.debt?.borrower?.id === user.id ||
      transaction.lending?.lender?.id === user.id;

    if (!canSee) {
      throw new ForbiddenException('Access denied to this transaction');
    }

    const baseForTotals =
      transaction.type === TransactionType.LENDING &&
      transaction.linkedTransaction
        ? transaction.linkedTransaction
        : transaction;

    const { totalPayments } = await this.addTotals(baseForTotals);

    return { ...transaction, totalPayments };
  }

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
        actorId: user.id, // approver
        payload: {
          mainTransactionId: transaction.id,
          linkedTransactionId: transaction.linkedTransactionId!,
          recipientId: transaction.initiatorId,
          newStatus: status,
        },
      }),
    );

    // this.events.emit(
    //   'transaction.status.changed',
    //   new TransactionStatusChangedEvent(
    //     transaction.id,
    //     transaction.linkedTransactionId!,
    //     user.id,
    //     transaction.initiatorId,
    //     status,
    //   ),
    // );
  }

  public async updateStatusAfterPayment(id: string) {
    const transaction = await this.prismaService.transaction.findUnique({
      where: { id },
      include: this.baseTransactionSelect,
    });

    const totalPaid = await this.debtService.computeTotalPaid(
      transaction.debt,
      transaction.amount.currency,
    );

    if (
      totalPaid === transaction.amount.value &&
      transaction.status !== Status.PAID
    ) {
      await this.prismaService.transaction.update({
        where: { id },
        data: {
          status: Status.PAID,
          linkedTransaction: { update: { status: Status.PAID } },
        },
      });
    }
  }

  private async addTotals(
    transaction: Prisma.TransactionGetPayload<{
      select: typeof BASE_TRANSACTION_SELECT;
    }>,
  ): Promise<
    Prisma.TransactionGetPayload<{ select: typeof BASE_TRANSACTION_SELECT }> & {
      totalPayments: { value: number; currency: Currency };
    }
  > {
    const total =
      transaction.debt.payments.length > 0
        ? await this.debtService.computeTotalPaid(
            transaction.debt,
            transaction.amount.currency,
          )
        : 0;
    return {
      ...transaction,
      totalPayments: {
        value: Number(total.toFixed(2)),
        currency: transaction.amount.currency,
      },
    };
  }
}
