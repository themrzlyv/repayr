import type { UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/app/lib/query-client";
import type { UpdateAccountInputType } from "../types/update-account.input";
import { AccountAdapter } from "../account.adapter";

export function updateAccountMutationOption(
  options?: UseMutationOptions<boolean, unknown, UpdateAccountInputType>
): UseMutationOptions<boolean, unknown, UpdateAccountInputType> {
  return {
    mutationFn: (data: UpdateAccountInputType) =>
      AccountAdapter.getInstance().updateAccount(data),
    mutationKey: ["update-account"],
    ...options,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ["accountInfo"] });
      await queryClient.invalidateQueries({ queryKey: ["categories-summary"] });
      options?.onSuccess?.(...args);
    },
  };
}
