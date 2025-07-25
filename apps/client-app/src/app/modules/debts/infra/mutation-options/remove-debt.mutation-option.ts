import type { UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/app/lib/query-client";
import { DebtsAdapter } from "../debts.adapter";

export function removeDebtMutationOption(
  options?: UseMutationOptions<void, unknown, string>
): UseMutationOptions<void, unknown, string> {
  return {
    mutationFn: (id: string) => DebtsAdapter.getInstance().removeDebt(id),
    mutationKey: ["remove-debt"],
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ["debt-list"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(...args);
    },
  };
}
