import { Currency, TransactionType } from '@/prisma/generated';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  IsNotEmpty,
  Min,
  IsEnum,
} from 'class-validator';

export class CreateAmount {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  value: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  @MaxLength(12)
  name?: string;

  @IsString()
  @IsOptional()
  counterpartyId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  description?: string;

  @IsNotEmpty()
  amount: CreateAmount;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  dueDate: Date;
}
