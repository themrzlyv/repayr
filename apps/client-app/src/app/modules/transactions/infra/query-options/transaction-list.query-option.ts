import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/app/shared/data/query-keys";
import type { GetTransactionsQueryType } from "../types/get-transactions-query";
import { TransactionsAdapter } from "../transactions.adapter";

export function transactionListQueryOption(query: GetTransactionsQueryType) {
  return queryOptions({
    queryKey: [
      queryKeys.TRANSACTION_LIST,
      ...Object.entries(query).map(([key, value]) => [key, value]),
    ],
    queryFn: () => TransactionsAdapter.getInstance().getTransactionList(query),
    placeholderData: previousData => previousData,
  });
}
