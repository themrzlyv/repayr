import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDebtInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @MinLength(1)
  @Min(0.01)
  amount: number;
}
