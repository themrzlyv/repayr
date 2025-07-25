import { queryOptions } from "@tanstack/react-query";
import { DebtsAdapter } from "../debts.adapter";

export function debtDetailsQueryOption(debtId: string) {
  return queryOptions({
    queryKey: ["debt-details", debtId],
    queryFn: () => DebtsAdapter.getInstance().getDebtDetails(debtId),
  });
}
