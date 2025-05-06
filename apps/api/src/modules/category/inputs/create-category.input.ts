import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @IsString()
  @IsNotEmpty()
  icon: string;
}
