import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { CreateCategoryInput } from './inputs/create-category.input';
import { User } from '@/prisma/generated';
import { CategoryQueriesInput } from './inputs/category-queries.input';

@Injectable()
export class CategoryService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createCategory(input: CreateCategoryInput) {
    const { title, icon } = input;

    const isExistCategory = await this.prismaService.category.findUnique({
      where: { title },
    });

    if (isExistCategory) {
      return new BadRequestException('Category already exists');
    }

    await this.prismaService.category.create({
      data: {
        title,
        icon,
      },
    });

    return true;
  }

  public async getCategories(userId: string, query: CategoryQueriesInput) {
    const isSelectingAll = query.select === 'all';

    const filter = isSelectingAll
      ? undefined
      : {
          Debt: {
            some: {
              userId,
            },
          },
        };

    const categories = await this.prismaService.category.findMany({
      where: filter,
    });

    return { categories };
  }

  public async getCategoryDetails(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    return { category };
  }

  public async updateCategoryDetails({
    id,
    input,
  }: {
    id: string;
    input: CreateCategoryInput;
  }) {
    const category = await this.prismaService.category.update({
      where: { id },
      data: {
        ...input,
      },
    });

    return { category };
  }

  public async deleteCategory(id: string) {
    await this.prismaService.category.delete({
      where: { id },
    });

    return true;
  }
}
