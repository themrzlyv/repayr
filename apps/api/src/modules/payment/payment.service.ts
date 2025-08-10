import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { ExchangeService } from '../exchange/exchange.service';
import { Currency, Status } from '@/prisma/generated';
import { DebtService } from '../debt/debt.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';
import { EVENT } from '@/src/shared/domain/events/event-types';
import { BaseEvent } from '@/src/shared/domain/events/base-event';
import { TransactionQueryService } from '../transaction/services/transaction.query.service';
import { TransactionMutationService } from '../transaction/services/transaction.mutation.service';

@Injectable()
export class PaymentService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly debtService: DebtService,
    private readonly transactionQueryService: TransactionQueryService,
    private readonly transactionMutationService: TransactionMutationService,
    private readonly exchangeService: ExchangeService,
    private readonly events: EventEmitter2,
  ) {}

  public async createPayment(input: CreatePaymentDto, user: RequestUserEntity) {
    const { amount, transactionId, debtId } = input;

    await this.transactionQueryService.getTransactionById(user, transactionId);

    const rest = await this.debtService.computeRestPayment(debtId);

    const overpaid = await this.isOverpaid(
      amount.value,
      amount.currency,
      rest.value,
      rest.currency,
    );

    if (overpaid) {
      throw new BadRequestException('Amount exceeds the remaining debt');
    }

    const payment = await this.prismaService.payment.create({
      data: {
        amount: { create: { ...amount } },
        debt: { connect: { id: debtId } },
        user: { connect: { id: user.id } },
      },
    });

    const { changedToPaid, linkedTransactionId, recipientId } =
      await this.transactionMutationService.updateStatusAfterPayment(
        transactionId,
        user.id,
      );

    if (changedToPaid) {
      this.events.emit(
        EVENT.TRANSACTION_STATUS_CHANGED,
        new BaseEvent({
          name: EVENT.TRANSACTION_STATUS_CHANGED,
          actorId: user.id,
          payload: {
            mainTransactionId: transactionId,
            linkedTransactionId: linkedTransactionId,
            recipientId: recipientId,
            newStatus: Status.PAID,
          },
        }),
      );
    } else {
      this.events.emit(
        EVENT.PAYMENT_CREATED,
        new BaseEvent({
          name: EVENT.PAYMENT_CREATED,
          actorId: user.id,
          payload: {
            paymentId: payment.id,
            debtId,
            transactionId,
          },
        }),
      );
    }

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
