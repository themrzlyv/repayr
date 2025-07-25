import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';

import { AccountService } from './account.service';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Session } from 'express-session';
import { SessionAuthGuard } from '@/src/shared/guards/session-auth.guard';
import { CsrfGuard } from '@/src/shared/guards/csrf.guard';
import { UpdateAccountInput } from './inputs/update-account.input';
import { SearchAccountQuery } from './inputs/search-account.query';

@Controller('account')
@UseGuards(SessionAuthGuard, CsrfGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  public me(@Authorized() session: Session) {
    return this.accountService.me(session);
  }

  @Get('search')
  public async searchAccount(
    @Authorized() session: Session,
    @Query() query: SearchAccountQuery,
  ) {
    return this.accountService.searchAccount(session.user.id, query.tagName);
  }

  @Put('update')
  public updateAccount(
    @Authorized() session: Session,
    @Body() input: UpdateAccountInput,
  ) {
    return this.accountService.updateAccount(session, input);
  }
}
