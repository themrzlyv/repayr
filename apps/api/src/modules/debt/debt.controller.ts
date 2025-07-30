import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';

import { DebtService } from './debt.service';
import { CreateDebtInput } from './inputs/create-debt.input';
import { Auth } from '@/src/shared/decorators/auth.decorator';
import { DebtListQuery } from './inputs/debt-list.input';
import { DebtLendingOrchestratorService } from '../orchestrators/debt-lending.orchestrator';
import { Request } from 'express';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';
import { RequestUser } from '@/src/shared/decorators/request-user.decorator';

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
    @RequestUser() user: RequestUserEntity,
  ) {
    return this.debtLendingOrchestratorService.createDebtWithOptionalLending(
      input,
      user.id,
    );
  }

  @Get('list')
  public async getDebts(
    @RequestUser() user: RequestUserEntity,
    @Query() query: DebtListQuery,
  ) {
    return this.debtService.getDebts(user.id, query);
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
