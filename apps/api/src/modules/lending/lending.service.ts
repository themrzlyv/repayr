import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateLendingInput } from './inputs/create-lending.input';
import { LendingListQuery } from './inputs/lending-list.input';
import { Session } from 'express-session';
import { Prisma } from '@/prisma/generated';

type Pagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

@Injectable()
export class LendingService {
  private readonly _lendingInclude = {
    category: {
      select: {
        id: true,
        title: true,
        icon: true,
        type: true,
      },
    },
    debt: {
      select: {
        payments: {
          include: { amount: true },
        },
      },
    },
  } satisfies Prisma.LendingInclude;

  public constructor(private readonly prismaService: PrismaService) {}

  public async createCore(input: CreateLendingInput, userId: string) {
    const lending = await this.prismaService.lending.create({
      data: {
        name: input.name,
        description: input.description,
        dueDate: input.dueDate,
        user: { connect: { id: userId } },
        category: { connect: { id: input.categoryId } },
        debt: { connect: { id: input.debtId } },
      },
    });

    return lending;
  }

  public async getLendings(session: Session, input: LendingListQuery) {
    const userId = session.user.id;
    const { sortDirection, sortField, searchQuery } = input;

    const page = Number(input.page || 1);
    const perPage = Number(input.perPage || 5);

    // const orderBy = debtSortMapper({ sortDirection, sortField });

    const skip = (page - 1) * perPage;
    const where = this.buildWhere(userId, searchQuery);

    const [lendings, total] = await this.prismaService.$transaction([
      this.prismaService.lending.findMany({
        where,
        include: this._lendingInclude,
        skip,
        take: perPage,
        // orderBy,
      }),
      this.prismaService.lending.count({ where }),
    ]);

    // const lendingsWithTotalPayments = await Promise.all(
    //   lendings.map((lending) =>
    //     lending.debt.payments.map(this.addTotals.bind(this)),
    //   ),
    // );

    return {
      pagination: this.buildPagination(page, perPage, total),
      lendings: lendings,
    };
  }

  // private async computeTotalPaid(lending: DebtEntity): Promise<number> {
  //   const rates = await this.exchangeService.getExchangeRates(
  //     debt.amount.currency,
  //   );

  //   return debt.payments.reduce((sum, { amount }) => {
  //     const rate = rates[amount.currency.toUpperCase()] ?? 1;
  //     return sum + amount.value * rate;
  //   }, 0);
  // }

  // private async addTotals(lending: DebtEntity): Promise<DebtWithTotals> {
  //   const total =
  //     debt.payments.length > 0 ? await this.computeTotalPaid(debt) : 0;
  //   return {
  //     ...debt,
  //     totalPayments: {
  //       value: Number(total.toFixed(2)),
  //       currency: debt.amount.currency,
  //     },
  //   };
  // }

  private buildWhere(
    userId: string,
    searchQuery?: string,
  ): Prisma.LendingWhereInput {
    return {
      userId,
      ...(searchQuery && {
        OR: [{ name: { contains: searchQuery, mode: 'insensitive' } }],
      }),
    };
  }

  private buildPagination(
    page: number,
    perPage: number,
    total: number,
  ): Pagination {
    return { page, perPage, total, totalPages: Math.ceil(total / perPage) };
  }
}
