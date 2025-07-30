import { Currency, Role } from '@/prisma/generated';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class TokenPayloadDto {
  @IsString()
  sub: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}
