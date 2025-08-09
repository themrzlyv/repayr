import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/app/shared/data/query-keys";
import { TransactionsAdapter } from "../transactions.adapter";

export function transactionDetailsQueryOption(debtId: string) {
  return queryOptions({
    queryKey: [queryKeys.TRANSACTION_DETAILS, debtId],
    queryFn: () =>
      TransactionsAdapter.getInstance().getTransactionDetails(debtId),
  });
}
