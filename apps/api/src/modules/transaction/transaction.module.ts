import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ExchangeModule } from '../exchange/exchange.module';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';
import { TransactionProgressListener } from './listeners/transaction-progress.listener';
import { DebtModule } from '../debt/debt.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [ExchangeModule, JwtTokenModule, DebtModule, CategoryModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionProgressListener],
  exports: [TransactionService],
})
export class TransactionModule {}
