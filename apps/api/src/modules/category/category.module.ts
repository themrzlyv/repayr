import { Module } from '@nestjs/common';


import { AccountService } from '../account/account.service';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [ExchangeModule],
  controllers: [CategoryController],
  providers: [CategoryService, AccountService],
})
export class CategoryModule {}
