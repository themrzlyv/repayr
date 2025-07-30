import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DebtModule } from '../debt/debt.module';
import { ExchangeModule } from '../exchange/exchange.module';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';

@Module({
  imports: [DebtModule, ExchangeModule, JwtTokenModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
