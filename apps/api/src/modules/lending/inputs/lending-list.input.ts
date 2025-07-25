import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { SortDirectionEnum } from '@/src/shared/types/sort-direction.enum';

export class LendingListQuery {
  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  perPage?: string;

  @IsOptional()
  sortField?: any;

  @IsEnum(SortDirectionEnum)
  @IsOptional()
  sortDirection?: SortDirectionEnum;

  @IsOptional()
  searchQuery?: string;
}
