import { SortDirectionEnum } from '@/src/shared/types/sort-direction.enum';
import { DebtsSortField } from '../types/debts-sort';

type Params = {
  sortField?: DebtsSortField;
  sortDirection?: SortDirectionEnum;
};

export function debtSortMapper({ sortDirection, sortField }: Params) {
  if (sortField && sortDirection) {
    if (sortField === 'amount') {
      return {
        amount: {
          value: sortDirection,
        },
      };
    }

    return {
      [sortField]: sortDirection,
    };
  }

  return null;
}
