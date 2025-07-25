import type { DebtListSortValueObject } from "../../domain/value-objects/debt-list-sort.value-object";

export type DebtListInputType = {
  page: number;
  perPage?: number;
  sort?: DebtListSortValueObject;
  searchQuery?: string;
};
