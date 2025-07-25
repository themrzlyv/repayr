import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { CreateDebtInput } from './inputs/create-debt.input';
import { debtSortMapper } from './mappers/debts-sort-query.mapper';
import { ExchangeService } from '../exchange/exchange.service';
import { Prisma, Status } from '@/prisma/generated';
import { DebtListQuery } from './inputs/debt-list.input';
import { Session } from 'express-session';
import { DebtEntity, DebtWithTotals } from './types/debt.entity';

type Pagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

@Injectable()
export class DebtService {
  private readonly _debtInclude = {
    category: {
      select: {
        id: true,
        title: true,
        icon: true,
        type: true,
      },
    },
    amount: true,
    payments: {
      select: { id: true, amount: true, createdAt: true, updatedAt: true },
    },
    lending: {
      select: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            tagName: true,
          },
        },
      },
    },
  } satisfies Prisma.DebtInclude;

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly exchangeService: ExchangeService,
  ) {}

  public async createCore(input: CreateDebtInput, userId: string) {
    const debt = await this.prismaService.debt.create({
      data: {
        name: input.name,
        description: input.description,
        payDate: input.payDate,
        user: { connect: { id: userId } },
        category: { connect: { id: input.categoryId } },
      },
    });

    return debt;
  }

  public async getDebts(session: Session, input: DebtListQuery) {
    const userId = session.user.id;
    const { sortDirection, sortField, searchQuery } = input;

    const page = Number(input.page || 1);
    const perPage = Number(input.perPage || 5);

    const orderBy = debtSortMapper({ sortDirection, sortField });

    const skip = (page - 1) * perPage;
    const where = this.buildWhere(userId, searchQuery);

    const [debts, total] = await this.prismaService.$transaction([
      this.prismaService.debt.findMany({
        where,
        include: this._debtInclude,
        skip,
        take: perPage,
        orderBy,
      }),
      this.prismaService.debt.count({ where }),
    ]);

    const debtsWithTotalPayments = await Promise.all(
      debts.map(this.addTotals.bind(this)),
    );

    return {
      pagination: this.buildPagination(page, perPage, total),
      debts: debtsWithTotalPayments,
    };
  }

  public async computeRestPayment(debtId: string) {
    const debt = await this.prismaService.debt.findUnique({
      where: { id: debtId },
      include: this._debtInclude,
    });
    const totalPaid = await this.computeTotalPaid(debt);
    const value = debt.amount.value - totalPaid;
    const currency = debt.amount.currency;

    return { value, currency };
  }

  public async checkDebtStatus(id: string) {
    const debt = await this.prismaService.debt.findUnique({
      where: { id },
      include: this._debtInclude,
    });

    const totalPaid = await this.computeTotalPaid(debt);

    if (totalPaid === debt.amount.value && debt.status !== Status.PAID) {
      await this.prismaService.debt.update({
        where: { id },
        data: { status: Status.PAID },
      });
    }
  }

  public async getDebtDetails(id: string) {
    const debt = await this.prismaService.debt.findUnique({
      where: { id },
      include: this._debtInclude,
    });
    return { debt: await this.addTotals(debt) };
  }

  public async updateDebtDetails({
    id,
    input,
  }: {
    id: string;
    input: CreateDebtInput;
  }) {
    await this.prismaService.debt.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        amount: {
          update: {
            where: { debt: { id } },
            data: {
              currency: input.amount.currency,
              value: input.amount.value,
            },
          },
        },
        payDate: input.payDate,
        category: { connect: { id: input.categoryId } },
      },
    });

    return true;
  }

  public async deleteDebt(id: string) {
    const debt = await this.prismaService.debt.delete({
      where: { id },
    });

    return true;
  }

  private async computeTotalPaid(debt: DebtEntity): Promise<number> {
    const rates = await this.exchangeService.getExchangeRates(
      debt.amount.currency,
    );

    return debt.payments.reduce((sum, { amount }) => {
      const rate = rates[amount.currency.toUpperCase()] ?? 1;
      return sum + amount.value * rate;
    }, 0);
  }

  private async addTotals(debt: DebtEntity): Promise<DebtWithTotals> {
    const total =
      debt.payments.length > 0 ? await this.computeTotalPaid(debt) : 0;
    return {
      ...debt,
      totalPayments: {
        value: Number(total.toFixed(2)),
        currency: debt.amount.currency,
      },
    };
  }

  private buildWhere(
    userId: string,
    searchQuery?: string,
  ): Prisma.DebtWhereInput {
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
