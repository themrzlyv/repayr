import { Body, Controller, Get, Put, Query } from '@nestjs/common';

import { AccountService } from './account.service';
import { UpdateAccountInput } from './inputs/update-account.input';
import { SearchAccountQuery } from './inputs/search-account.query';
import { Auth } from '@/src/shared/decorators/auth.decorator';
import { RequestUser } from '@/src/shared/decorators/request-user.decorator';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';

@Controller('account')
@Auth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  public me(@RequestUser() user: RequestUserEntity) {
    return this.accountService.me(user.id);
  }

  @Get('search')
  public async searchAccount(
    @RequestUser() user: RequestUserEntity,
    @Query() query: SearchAccountQuery,
  ) {
    return this.accountService.searchAccount(user.id, query.tagName);
  }

  @Put('update')
  public updateAccount(
    @RequestUser() user: RequestUserEntity,
    @Body() input: UpdateAccountInput,
  ) {
    return this.accountService.updateAccount(user.id, input);
  }
}
