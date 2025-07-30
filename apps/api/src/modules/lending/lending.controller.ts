import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { LendingService } from './lending.service';
import { CreateLendingInput } from './inputs/create-lending.input';
import { LendingDebtOrchestratorService } from '../orchestrators/lending-debt.orchestrator';
import { Session } from 'express-session';
import { LendingListQuery } from './inputs/lending-list.input';
import { Auth } from '@/src/shared/decorators/auth.decorator';
import { Request } from 'express';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';
import { RequestUser } from '@/src/shared/decorators/request-user.decorator';

@Controller('lending')
@Auth()
export class LendingController {
  constructor(
    private readonly lendingService: LendingService,
    private readonly lendingDebtOrchestratorService: LendingDebtOrchestratorService,
  ) {}

  @Post('create')
  public async createLending(
    @Body() input: CreateLendingInput,
    @RequestUser() user: RequestUserEntity,
  ) {
    return this.lendingDebtOrchestratorService.createLendingWithOptionalDebt(
      input,
      user.id,
    );
  }

  @Get('list')
  public async getLendings(
    @RequestUser() user: RequestUserEntity,
    @Query() query: LendingListQuery,
  ) {
    return this.lendingService.getLendings(user.id, query);
  }
}
