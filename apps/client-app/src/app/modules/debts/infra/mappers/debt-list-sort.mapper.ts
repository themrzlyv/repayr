import type { SortDescriptor } from "@heroui/react";

import type { DebtListSortValueObject } from "../../domain/value-objects/debt-list-sort.value-object";
export function debtListSortMapper(
  data: SortDescriptor
): DebtListSortValueObject {
  const direction = data?.direction === "ascending" ? "asc" : "desc";
  if (data?.column === "payDate") {
    return {
      sortField: "pay_date",
      sortDirection: direction,
    };
  }

  if (data?.column === "amount.value") {
    return {
      sortField: "amount",
      sortDirection: direction,
    };
  }

  return {
    sortField: data?.column,
    sortDirection: direction,
  }
}
