import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Role, Session, User } from '@/prisma/generated';
import { Roles } from '@/src/shared/decorators/roles.decorator';
import { RolesGuard } from '@/src/shared/guards/roles.guard';

import { CategoryService } from './category.service';
import { CreateCategoryInput } from './inputs/create-category.input';
import { SessionAuthGuard } from '@/src/shared/guards/session-auth.guard';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { CategoryQueriesInput } from './inputs/category-queries.input';
import { CsrfGuard } from '@/src/shared/guards/csrf.guard';

@Controller('category')
@UseGuards(SessionAuthGuard, CsrfGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @Roles(Role.ADMIN)
  public async createCategory(@Body() input: CreateCategoryInput) {
    return this.categoryService.createCategory(input);
  }

  @Get('')
  public async getCategories(
    @Authorized() session: Session,
    @Query() query: CategoryQueriesInput,
  ) {
    return await this.categoryService.getCategories(session.userId, query);
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
