import { queryOptions } from "@tanstack/react-query";
import { DebtsAdapter } from "../debts.adapter";
import { queryKeys } from "@/app/shared/data/query-keys";

export function debtDetailsQueryOption(debtId: string) {
  return queryOptions({
    queryKey: [queryKeys.DEBT_DETAILS, debtId],
    queryFn: () => DebtsAdapter.getInstance().getDebtDetails(debtId),
  });
}
