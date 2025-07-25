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

import { Role } from '@/prisma/generated';
import { Roles } from '@/src/shared/decorators/roles.decorator';
import { RolesGuard } from '@/src/shared/guards/roles.guard';

import { CategoryService } from './category.service';
import { CreateCategoryInput } from './inputs/create-category.input';
import { SessionAuthGuard } from '@/src/shared/guards/session-auth.guard';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { CategoryQueriesInput } from './inputs/category-queries.input';
import { CsrfGuard } from '@/src/shared/guards/csrf.guard';
import { Session } from 'express-session';

@Controller('category')
@UseGuards(SessionAuthGuard, CsrfGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  public async createCategory(
    @Body() input: CreateCategoryInput,
    @Authorized() session: Session,
  ) {
    return this.categoryService.createCategory(input, session);
  }

  @Get('')
  public async getCategories(
    @Authorized() session: Session,
    @Query() query: CategoryQueriesInput,
  ) {
    return await this.categoryService.getCategories(session.user.id, query);
  }

  @Get('summary')
  public async getCategoriesSummary(@Authorized() session: Session) {
    return await this.categoryService.getCategoriesSummary(
      session.user.id,
      session.user.currency,
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
