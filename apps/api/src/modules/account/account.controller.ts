import { Body, Controller, Get, Put, Query } from '@nestjs/common';

import { AccountService } from './account.service';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { SearchAccountDto } from './dtos/search-account.dto';
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
    @Query() query: SearchAccountDto,
  ) {
    return this.accountService.searchAccount(user.id, query.tagName);
  }

  @Put('update')
  public updateAccount(
    @RequestUser() user: RequestUserEntity,
    @Body() input: UpdateAccountDto,
  ) {
    return this.accountService.updateAccount(user.id, input);
  }
}
