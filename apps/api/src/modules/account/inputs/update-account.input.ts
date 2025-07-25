import { Currency } from '@/prisma/generated';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateAccountInput {
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}
