import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CategoryTypeEnum } from '../types/category-type.enum';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsOptional()
  @IsEnum(CategoryTypeEnum)
  type: CategoryTypeEnum;
}
