import { forwardRef, Module } from '@nestjs/common';

import { DebtController } from './debt.controller';
import { DebtService } from './debt.service';
import { ExchangeModule } from '../exchange/exchange.module';

import { OrchestratorsModule } from '../orchestrators/orchestrators.module';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';

@Module({
  imports: [
    ExchangeModule,
    forwardRef(() => OrchestratorsModule),
    JwtTokenModule,
  ],
  controllers: [DebtController],
  providers: [DebtService],
  exports: [DebtService],
})
export class DebtModule {}
