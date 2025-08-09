import { IsEnum, IsOptional } from 'class-validator';
import { CategoryTypeEnum } from '../types/category-type.enum';

export class CategoryListDto {
  @IsOptional()
  @IsEnum([CategoryTypeEnum.CUSTOM, CategoryTypeEnum.SYSTEM, 'ALL', 'USED'])
  filter?: CategoryTypeEnum | 'ALL' | 'USED';
}
