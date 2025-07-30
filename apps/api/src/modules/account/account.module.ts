import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';

@Module({
  imports: [JwtTokenModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
