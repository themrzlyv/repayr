import { Module } from '@nestjs/common';


import { AccountService } from '../account/account.service';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ExchangeModule } from '../exchange/exchange.module';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';

@Module({
  imports: [ExchangeModule, JwtTokenModule],
  controllers: [CategoryController],
  providers: [CategoryService, AccountService],
  exports: [CategoryService],
})
export class CategoryModule {}
