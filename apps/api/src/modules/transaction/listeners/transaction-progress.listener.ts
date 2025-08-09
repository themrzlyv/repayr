import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionService } from '../transaction.service';
import { PaymentCreatedEvent } from '@/src/shared/domain/events/domain-events';

@Injectable()
export class TransactionProgressListener {
  constructor(private readonly txService: TransactionService) {}

  @OnEvent('payment.created', { async: false })
  async handlePaymentCreated(evt: PaymentCreatedEvent) {
    await this.txService.updateStatusAfterPayment(evt.payload.transactionId);
  }
}
