import { Controller, Get, UseGuards } from '@nestjs/common';

import { AccountService } from './account.service';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Session } from '@/prisma/generated';
import { SessionAuthGuard } from '@/src/shared/guards/session-auth.guard';
import { CsrfGuard } from '@/src/shared/guards/csrf.guard';

@Controller('account')
@UseGuards(SessionAuthGuard, CsrfGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  public me(@Authorized() session: Session) {
    return this.accountService.me(session);
  }
}
