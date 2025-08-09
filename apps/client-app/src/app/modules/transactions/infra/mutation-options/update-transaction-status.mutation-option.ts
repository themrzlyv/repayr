import type { UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/app/lib/query-client";
import type { CreateTransactionInputType } from "../types/create-transaction.input";
import { TransactionsAdapter } from "../transactions.adapter";
import { queryKeys } from "@/app/shared/data/query-keys";
import type { UpdateTransactionStatusInputType } from "../types/update-transaction-status.input";

export function updateTransactionStatusMutationOption(
  options?: UseMutationOptions<
    boolean,
    unknown,
    UpdateTransactionStatusInputType
  >
): UseMutationOptions<boolean, unknown, UpdateTransactionStatusInputType> {
  return {
    mutationFn: (data: UpdateTransactionStatusInputType) =>
      TransactionsAdapter.getInstance().updateTransactionStatus(data),
    mutationKey: ["update-transaction"],
    ...options,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.TRANSACTION_LIST],
      });
      await queryClient.invalidateQueries({ queryKey: ["transaction-list"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await queryClient.invalidateQueries({ queryKey: ["categories-summary"] });
      options?.onSuccess?.(...args);
    },
  };
}
