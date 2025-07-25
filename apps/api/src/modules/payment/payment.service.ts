import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentInput } from './inputs/create-payment.input';
import { DebtService } from '../debt/debt.service';
import { ExchangeService } from '../exchange/exchange.service';
import { Currency } from '@/prisma/generated';

@Injectable()
export class PaymentService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly debtService: DebtService,
    private readonly exchangeService: ExchangeService,
  ) {}

  public async createPayment(input: CreatePaymentInput, userId: string) {
    const { amount, debt_id } = input;

    const rest = await this.debtService.computeRestPayment(debt_id);

    const overpaid = await this.isOverpaid(
      amount.value,
      amount.currency,
      rest.value,
      rest.currency,
    );

    if (overpaid) {
      throw new BadRequestException('Amount exceeds the remaining debt');
    }

    await this.prismaService.payment.create({
      data: {
        amount: { create: { ...amount } },
        debt: { connect: { id: debt_id } },
        user: { connect: { id: userId } },
      },
    });

    await this.debtService.checkDebtStatus(debt_id);

    return true;
  }

  private async isOverpaid(
    inputValue: number,
    inputCurrency: Currency,
    maxValue: number,
    maxCurrency: Currency,
  ): Promise<boolean> {
    if (inputCurrency === maxCurrency) {
      return inputValue > maxValue;
    }

    const rates = await this.exchangeService.getExchangeRates(maxCurrency);
    const rate = rates[inputCurrency.toUpperCase()];
    const convertedValue = inputValue * (rate ?? 1);

    return convertedValue > maxValue;
  }
}
