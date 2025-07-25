import type { UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/app/lib/query-client";
import { DebtsAdapter } from "../debts.adapter";
import type { CreateDebtInputType } from "../types/create-debt.input";

export function createDebtMutationOption(
  options?: UseMutationOptions<boolean, unknown, CreateDebtInputType>
): UseMutationOptions<boolean, unknown, CreateDebtInputType> {
  return {
    mutationFn: (data: CreateDebtInputType) =>
      DebtsAdapter.getInstance().createDebt(data),
    mutationKey: ["create-debt"],
    ...options,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ["debt-list"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await queryClient.invalidateQueries({ queryKey: ["categories-summary"] });
      options?.onSuccess?.(...args);
    },
  };
}
