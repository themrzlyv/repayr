import type { UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/app/lib/query-client";
import type { CreateTransactionInputType } from "../types/create-transaction.input";
import { TransactionsAdapter } from "../transactions.adapter";
import { queryKeys } from "@/app/shared/data/query-keys";

export function createTransactionMutationOption(
  options?: UseMutationOptions<boolean, unknown, CreateTransactionInputType>
): UseMutationOptions<boolean, unknown, CreateTransactionInputType> {
  return {
    mutationFn: (data: CreateTransactionInputType) =>
      TransactionsAdapter.getInstance().createTransaction(data),
    mutationKey: ["create-transaction"],
    ...options,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.TRANSACTION_LIST],
      });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await queryClient.invalidateQueries({ queryKey: ["categories-summary"] });
      options?.onSuccess?.(...args);
    },
  };
}
