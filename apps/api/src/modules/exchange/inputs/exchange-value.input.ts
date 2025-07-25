import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ExchangeValueInput {
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
