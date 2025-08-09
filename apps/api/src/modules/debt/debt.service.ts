import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { ExchangeService } from '../exchange/exchange.service';
import { Currency, Prisma } from '@/prisma/generated';
import { BASE_DEBT_SELECT } from '@/src/shared/data/prisma-selects';

@Injectable()
export class DebtService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly exchangeService: ExchangeService,
  ) {}

  public async computeRestPayment(debtId: string) {
    const debt = await this.prismaService.debt.findUnique({
      where: { id: debtId },
      select: {
        ...BASE_DEBT_SELECT,
        transaction: { select: { amount: true } },
      },
    });
    const totalPaid = await this.computeTotalPaid(
      debt,
      debt.transaction.amount.currency,
    );
    const value = debt.transaction.amount.value - totalPaid;
    const currency = debt.transaction.amount.currency;

    return { value, currency };
  }

  public async computeTotalPaid(
    debt: Prisma.DebtGetPayload<{
      select: typeof BASE_DEBT_SELECT;
    }>,
    currency: Currency,
  ): Promise<number> {
    const rates = await this.exchangeService.getExchangeRates(currency);

    return debt.payments.reduce((sum, { amount }) => {
      const rate = rates[amount.currency.toUpperCase()] ?? 1;
      return sum + amount.value * rate;
    }, 0);
  }
}
