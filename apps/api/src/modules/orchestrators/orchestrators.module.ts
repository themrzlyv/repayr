import { forwardRef, Module } from '@nestjs/common';
import { DebtLendingOrchestratorService } from './debt-lending.orchestrator';

import { DebtModule } from '@/src/modules/debt/debt.module';
import { LendingModule } from '@/src/modules/lending/lending.module';
import { AmountModule } from '@/src/modules/amount/amount.module';
import { LendingDebtOrchestratorService } from './lending-debt.orchestrator';

@Module({
  imports: [
    forwardRef(() => DebtModule),
    forwardRef(() => LendingModule),
    AmountModule,
  ],
  providers: [DebtLendingOrchestratorService, LendingDebtOrchestratorService],
  exports: [DebtLendingOrchestratorService, LendingDebtOrchestratorService],
})
export class OrchestratorsModule {}
