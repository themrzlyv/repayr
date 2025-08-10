import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';
import { Currency, Prisma, TransactionType } from '@/prisma/generated';
import { BASE_TRANSACTION_SELECT } from '@/src/shared/data/prisma-selects';
import { DebtService } from '../../debt/debt.service';
import { GetTransactionsDto } from '../dtos/get-transactions.dto';
import { TRANSACTION_WITH_LINK_SELECT } from '../selects';
import { assertCanSeeTransaction } from '../policies/transaction-access.policy';

@Injectable()
export class TransactionQueryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly debtService: DebtService,
  ) {}

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
        select: TRANSACTION_WITH_LINK_SELECT,
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
      select: TRANSACTION_WITH_LINK_SELECT,
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    assertCanSeeTransaction(user.id, transaction);

    const baseForTotals =
      transaction.type === TransactionType.LENDING &&
      transaction.linkedTransaction
        ? transaction.linkedTransaction
        : transaction;

    const { totalPayments } = await this.addTotals(baseForTotals);

    return { ...transaction, totalPayments };
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
