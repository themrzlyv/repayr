import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LendingService } from './lending.service';
import { CreateLendingInput } from './inputs/create-lending.input';
import { LendingDebtOrchestratorService } from '../orchestrators/lending-debt.orchestrator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Session } from 'express-session';
import { LendingListQuery } from './inputs/lending-list.input';

@Controller('lending')
export class LendingController {
  constructor(
    private readonly lendingService: LendingService,
    private readonly lendingDebtOrchestratorService: LendingDebtOrchestratorService,
  ) {}

  @Post('create')
  public async createLending(
    @Body() input: CreateLendingInput,
    @Authorized() session: Session,
  ) {
    return this.lendingDebtOrchestratorService.createLendingWithOptionalDebt(
      input,
      session.user.id,
    );
  }

  @Get('list')
  public async getLendings(
    @Authorized() session: Session,
    @Query() query: LendingListQuery,
  ) {
    return this.lendingService.getLendings(session, query);
  }
}
