import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { DebtService } from './debt.service';
import { Session } from 'express-session';
import { CreateDebtInput } from './inputs/create-debt.input';
import { Auth } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { DebtListQuery } from './inputs/debt-list.input';
import { DebtLendingOrchestratorService } from '../orchestrators/debt-lending.orchestrator';

@Controller('debt')
@Auth()
export class DebtController {
  constructor(
    private readonly debtService: DebtService,
    private readonly debtLendingOrchestratorService: DebtLendingOrchestratorService,
  ) {}

  @Post('create')
  public createDebt(
    @Body() input: CreateDebtInput,
    @Authorized() session: Session,
  ) {
    return this.debtLendingOrchestratorService.createDebtWithOptionalLending(
      input,
      session.user.id,
    );
  }

  @Get('list')
  public async getDebts(
    @Authorized() session: Session,
    @Query() query: DebtListQuery,
  ) {
    return this.debtService.getDebts(session, query);
  }

  @Get(':id')
  public async getDebtDetails(@Param('id') id: string) {
    return this.debtService.getDebtDetails(id);
  }

  @Put(':id')
  public async updateDebtDetails(
    @Param('id') id: string,
    @Body() input: CreateDebtInput,
  ) {
    return this.debtService.updateDebtDetails({ id, input });
  }

  @Delete(':id')
  public async deleteCategory(@Param('id') id: string) {
    return this.debtService.deleteDebt(id);
  }
}
