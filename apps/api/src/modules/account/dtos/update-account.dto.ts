import { Currency } from '@/prisma/generated';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateAccountDto {
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}
