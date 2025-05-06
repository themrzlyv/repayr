import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { CreateDebtInput } from './inputs/create-debt.input';

@Injectable()
export class DebtService {
  public constructor(private readonly prismaService: PrismaService) {}

  public createDebt(input: CreateDebtInput) {
    console.log('Creating debt with input', input);
  }
}
