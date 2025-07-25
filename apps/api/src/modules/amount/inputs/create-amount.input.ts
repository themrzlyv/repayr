import { Currency } from '@/prisma/generated';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class Amount {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  value: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}

export class CreateAmountInput {
  @IsOptional()
  @IsString()
  lendingId?: string;

  @IsOptional()
  @IsString()
  debtId?: string;

  @IsNotEmpty()
  amount: Amount;
}
