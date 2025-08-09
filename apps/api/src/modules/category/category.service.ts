import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryListDto } from './dtos/category-list.dto';
import { CategoryTypeEnum } from './types/category-type.enum';
import { Currency, Role } from '@/prisma/generated';
import { ExchangeService } from '../exchange/exchange.service';
import { CategorySummaryMap } from './types/category-summary-type';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';
import { BASE_CATEGORY_SELECT } from '@/src/shared/data/prisma-selects';

@Injectable()
export class CategoryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly exchangeService: ExchangeService,
  ) {}

  public async createCategory(
    input: CreateCategoryDto,
    userData: RequestUserEntity,
  ) {
    const { title, icon, type } = input;

    const isExistCategory = await this.prismaService.category.findUnique({
      where: { userId_title: { title, userId: userData.id } },
    });

    if (isExistCategory) {
      return new BadRequestException('Category already exists');
    }

    if (type === CategoryTypeEnum.SYSTEM && userData.role !== Role.ADMIN) {
      return new BadRequestException('Only admin can create system category');
    }

    await this.prismaService.category.create({
      data: {
        title,
        icon,
        type: type || CategoryTypeEnum.CUSTOM,
        ...(type !== CategoryTypeEnum.SYSTEM && {
          user: { connect: { id: userData.id } },
        }),
      },
    });

    return true;
  }

  public async getCategories(userId: string, query: CategoryListDto) {
    const where = this.buildCategoryFilter(userId, query?.filter);

    const categories = await this.prismaService.category.findMany({
      where,
    });

    return { categories };
  }

  public async getCategoriesSummary(userId: string, targetCurrency: Currency) {
    const categories = await this.prismaService.category.findMany({
      where: { user: { id: userId } },
      include: {
        transactions: {
          where: {
            owner: {
              id: userId,
            },
            status: { equals: 'ACCEPTED' },
          },
          include: {
            amount: true,
          },
        },
      },
    });

    const exchangeRates =
      await this.exchangeService.getExchangeRates(targetCurrency);

    const result: CategorySummaryMap = {};

    for (const category of categories) {
      const total = category.transactions.reduce((sum, debt) => {
        const value = debt.amount?.value ?? 0;
        const fromCurrency = debt.amount?.currency ?? targetCurrency;
        const rate = exchangeRates[fromCurrency.toUpperCase()];
        return rate ? sum + value * rate : sum;
      }, 0);

      result[category.id] = {
        currency: targetCurrency,
        total: Number(total.toFixed(2)),
      };
    }

    return result;
  }

  public async getCategoryDetails(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      select: BASE_CATEGORY_SELECT,
    });

    return { category };
  }

  public async updateCategoryDetails({
    id,
    input,
  }: {
    id: string;
    input: CreateCategoryDto;
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

  private buildCategoryFilter(
    userId: string,
    filter?: CategoryTypeEnum | 'ALL' | 'USED',
  ) {
    switch (filter) {
      case CategoryTypeEnum.CUSTOM:
        return {
          type: CategoryTypeEnum.CUSTOM,
          userId,
        };
      case CategoryTypeEnum.SYSTEM:
        return {
          type: CategoryTypeEnum.SYSTEM,
          userId: null,
        };
      case 'USED':
        return {
          transactions: {
            some: {
              owner: {
                id: userId,
              },
            },
          },
        };
      case 'ALL':
      case undefined:
      default:
        return {
          OR: [{ userId }, { type: CategoryTypeEnum.SYSTEM, userId: null }],
        };
    }
  }
}
