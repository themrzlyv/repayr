import { Currency } from '@/prisma/generated';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
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

export class CreateLendingInput {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  name?: string;

  @IsString()
  @IsOptional()
  debtorId?: string;

  @IsString()
  @IsOptional()
  debtId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  description?: string;

  @IsOptional()
  amount?: CreateAmount;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  dueDate: Date;
}
