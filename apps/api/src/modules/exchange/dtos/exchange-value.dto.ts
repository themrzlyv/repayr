import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ExchangeValueDto {
  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
