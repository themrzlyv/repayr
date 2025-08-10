import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { ExchangeModule } from '../exchange/exchange.module';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';
import { DebtModule } from '../debt/debt.module';
import { CategoryModule } from '../category/category.module';
import { TransactionQueryService } from './services/transaction.query.service';
import { TransactionMutationService } from './services/transaction.mutation.service';

@Module({
  imports: [ExchangeModule, JwtTokenModule, DebtModule, CategoryModule],
  controllers: [TransactionController],
  providers: [TransactionQueryService, TransactionMutationService],
  exports: [TransactionQueryService, TransactionMutationService],
})
export class TransactionModule {}
