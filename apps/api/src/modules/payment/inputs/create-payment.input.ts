import { Currency } from '@/prisma/generated';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateAmount {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  value: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}

export class CreatePaymentInput {
  @IsNotEmpty()
  amount: CreateAmount;

  @IsString()
  @IsNotEmpty()
  debt_id: string;
}
