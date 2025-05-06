import { Body, Controller, Post } from '@nestjs/common';

import { DebtService } from './debt.service';
import { CreateDebtInput } from './inputs/create-debt.input';
import { Auth } from '@/src/shared/decorators/auth.decorator';

@Controller('debt')
@Auth()
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post('create')
  public createDebt(@Body() input: CreateDebtInput) {
    return this.debtService.createDebt(input);
  }
}
