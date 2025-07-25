import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DebtModule } from '../debt/debt.module';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [DebtModule, ExchangeModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
