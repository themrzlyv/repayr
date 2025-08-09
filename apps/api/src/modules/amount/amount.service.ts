import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAmountDto } from './dtos/create-amount.dto';

@Injectable()
export class AmountService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async createAmount(input: CreateAmountDto) {
    const { amount, debtId, lendingId } = input;
    await this.prismaService.amount.create({
      data: {
        ...amount,
        value: parseFloat(amount.value.toFixed(2)),
        ...(debtId && { debt: { connect: { id: debtId } } }),
        ...(lendingId && { lending: { connect: { id: lendingId } } }),
      },
    });

    return true;
  }
}
