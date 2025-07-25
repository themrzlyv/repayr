import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { DebtsSortField } from '../types/debts-sort';
import { SortDirectionEnum } from '@/src/shared/types/sort-direction.enum';

export class DebtListQuery {
  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  perPage?: string;

  @IsEnum(DebtsSortField)
  @IsOptional()
  sortField?: DebtsSortField;

  @IsEnum(SortDirectionEnum)
  @IsOptional()
  sortDirection?: SortDirectionEnum;

  @IsOptional()
  searchQuery?: string;
}
