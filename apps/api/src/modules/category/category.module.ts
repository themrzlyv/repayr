import { Module } from '@nestjs/common';


import { AccountService } from '../account/account.service';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, AccountService],
})
export class CategoryModule {}
