import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { CreateCategoryInput } from './inputs/create-category.input';
import { CategoryQueriesInput } from './inputs/category-queries.input';
import { CategoryTypeEnum } from './types/category-type.enum';
import { Currency, Role } from '@/prisma/generated';
import { Session } from 'express-session';
import { ExchangeService } from '../exchange/exchange.service';
import { CategorySummaryMap } from './types/category-summary-type';

@Injectable()
export class CategoryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly exchangeService: ExchangeService,
  ) {}

  public async createCategory(input: CreateCategoryInput, session: Session) {
    const { title, icon, type } = input;

    const isExistCategory = await this.prismaService.category.findUnique({
      where: { title },
    });

    if (isExistCategory) {
      return new BadRequestException('Category already exists');
    }

    if (type === CategoryTypeEnum.SYSTEM && session.user.role !== Role.ADMIN) {
      return new BadRequestException('Only admin can create system category');
    }

    await this.prismaService.category.create({
      data: {
        title,
        icon,
        type: type || CategoryTypeEnum.CUSTOM,
        ...(type !== CategoryTypeEnum.SYSTEM && {
          user: { connect: { id: session.user.id } },
        }),
      },
    });

    return true;
  }

  public async getCategories(userId: string, query: CategoryQueriesInput) {
    const where = this.buildCategoryFilter(userId, query?.filter);

    const categories = await this.prismaService.category.findMany({
      where,
      include: {
        debts: {
          where: {
            user: {
              id: userId,
            },
          },
          include: {
            amount: true,
          },
        },
      },
    });

    return { categories };
  }

  public async getCategoriesSummary(userId: string, targetCurrency: Currency) {
    const categories = await this.prismaService.category.findMany({
      where: { user: { id: userId } },
      include: {
        debts: {
          where: {
            user: {
              id: userId,
            },
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
      const total = category.debts.reduce((sum, debt) => {
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
          debts: {
            some: {
              user: {
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
