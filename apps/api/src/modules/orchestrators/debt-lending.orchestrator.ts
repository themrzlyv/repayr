import { Injectable } from '@nestjs/common';
import { DebtService } from '@/src/modules/debt/debt.service';
import { LendingService } from '@/src/modules/lending/lending.service';
import { AmountService } from '@/src/modules/amount/amount.service';
import { CreateDebtInput } from '@/src/modules/debt/inputs/create-debt.input';

@Injectable()
export class DebtLendingOrchestratorService {
  constructor(
    private readonly debtService: DebtService,
    private readonly lendingService: LendingService,
    private readonly amountService: AmountService,
  ) {}

  async createDebtWithOptionalLending(input: CreateDebtInput, userId: string) {
    const { amount, lenderId, ...debtData } = input;

    const debt = await this.debtService.createCore(debtData, userId);

    let lendingId: string | undefined;

    if (lenderId) {
      const lending = await this.lendingService.createCore(
        {
          dueDate: debt.payDate,
          categoryId: debt.categoryId,
          debtId: debt.id,
        },
        lenderId,
      );
      lendingId = lending.id;
    }

    await this.amountService.createAmount({
      amount,
      debtId: debt.id,
      lendingId,
    });

    return debt;
  }
}
