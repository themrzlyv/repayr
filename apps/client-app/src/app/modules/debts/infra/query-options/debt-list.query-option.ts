import { queryOptions } from "@tanstack/react-query";
import { DebtsAdapter } from "../debts.adapter";
import type { DebtListInputType } from "../types/debt-list.input";
import { queryKeys } from "@/app/shared/data/query-keys";

export function debtListQueryOption({
  page,
  perPage,
  sort,
  searchQuery,
}: DebtListInputType) {
  return queryOptions({
    queryKey: [queryKeys.DEBT_LIST, page, perPage, sort, searchQuery],
    queryFn: () =>
      DebtsAdapter.getInstance().getDebtList({
        page,
        perPage,
        sort,
        searchQuery,
      }),
    placeholderData: previousData => previousData,
  });
}
