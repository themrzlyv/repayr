import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountModule } from '../modules/account/account.module';
import { AuthModule } from '../modules/auth/auth.module';
import { CategoryModule } from '../modules/category/category.module';
import { IS_DEV_ENV } from '../shared/utils/is-dev.util';

import { PrismaModule } from './prisma/prisma.module';
import { ExchangeModule } from '../modules/exchange/exchange.module';
import { PaymentModule } from '../modules/payment/payment.module';
import { AmountModule } from '../modules/amount/amount.module';
import { TransactionModule } from '../modules/transaction/transaction.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DebtModule } from '../modules/debt/debt.module';
import { NotificationModule } from '../modules/notification/notification.module';
import { RealtimeModule } from '../modules/realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !IS_DEV_ENV,
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      wildcard: false,
      global: true,
    }),
    PrismaModule,
    AccountModule,
    AuthModule,
    CategoryModule,
    DebtModule,
    ExchangeModule,
    PaymentModule,
    AmountModule,
    TransactionModule,
    NotificationModule,
    RealtimeModule,
  ],
})
export class CoreModule {}
