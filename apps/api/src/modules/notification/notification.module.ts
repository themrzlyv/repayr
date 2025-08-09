import { Module } from '@nestjs/common';
import { TransactionCreatedListener } from './listeners/transaction-created.listener';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';
import { PaymentCreatedListener } from './listeners/payment-created.listener';
import { TransactionStatusChangedListener } from './listeners/transaction-status-changed.listener';

@Module({
  imports: [JwtTokenModule],
  providers: [
    NotificationService,
    TransactionCreatedListener,
    PaymentCreatedListener,
    TransactionStatusChangedListener,
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
