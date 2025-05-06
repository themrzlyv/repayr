import { Module } from '@nestjs/common';

import { DebtController } from './debt.controller';
import { DebtService } from './debt.service';
import { AccountService } from '../account/account.service';

@Module({
  controllers: [DebtController],
  providers: [DebtService, AccountService],
})
export class DebtModule {}
