import { Injectable } from '@nestjs/common';
import { DebtService } from '@/src/modules/debt/debt.service';
import { LendingService } from '@/src/modules/lending/lending.service';
import { AmountService } from '@/src/modules/amount/amount.service';

import { CreateLendingInput } from '@/src/modules/lending/inputs/create-lending.input';

@Injectable()
export class LendingDebtOrchestratorService {
  constructor(
    private readonly lendingService: LendingService,
    private readonly debtService: DebtService,
    private readonly amountService: AmountService,
  ) {}

  public async createLendingWithOptionalDebt(
    input: CreateLendingInput,
    userId: string,
  ) {
    const { amount, debtorId } = input;

    const lending = await this.lendingService.createCore(input, userId);

    let debtId: string | undefined;

    if (debtorId) {
      const debt = await this.debtService.createCore(
        {
          payDate: input.dueDate,
          categoryId: input.categoryId,
          lenderId: userId,
        },
        debtorId,
      );

      debtId = debt.id;
    }

    await this.amountService.createAmount({
      amount,
      debtId,
      lendingId: lending.id,
    });

    return lending;
  }
}
