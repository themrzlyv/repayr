import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Role } from '@/prisma/generated';
import { Roles } from '@/src/shared/decorators/roles.decorator';
import { RolesGuard } from '@/src/shared/guards/roles.guard';

import { CategoryService } from './category.service';
import { CreateCategoryInput } from './inputs/create-category.input';
import { CategoryQueriesInput } from './inputs/category-queries.input';
import { Auth } from '@/src/shared/decorators/auth.decorator';
import { Request } from 'express';
import { RequestUser } from '@/src/shared/decorators/request-user.decorator';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';

@Controller('category')
@Auth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  public async createCategory(
    @Body() input: CreateCategoryInput,
    @RequestUser() user: RequestUserEntity,
  ) {
    return this.categoryService.createCategory(input, user);
  }

  @Get('')
  public async getCategories(
    @RequestUser() user: RequestUserEntity,
    @Query() query: CategoryQueriesInput,
  ) {
    return await this.categoryService.getCategories(user.id, query);
  }

  @Get('summary')
  public async getCategoriesSummary(@RequestUser() user: RequestUserEntity) {
    return await this.categoryService.getCategoriesSummary(
      user.id,
      user.currency,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  public async getCategoryDetails(@Param('id') id: string) {
    return this.categoryService.getCategoryDetails(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  public async updateCategoryDetails(
    @Param('id') id: string,
    @Body() input: CreateCategoryInput,
  ) {
    return this.categoryService.updateCategoryDetails({ id, input });
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  public async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
