// import type { UseMutationOptions } from "@tanstack/react-query";
// import { queryClient } from "@/app/lib/query-client";
// import { DebtsAdapter } from "../debts.adapter";
// import type { UpdateDebtInputType } from "../types/update-debt.input";

// export function updateDebtMutationOption(
//   options?: UseMutationOptions<boolean, unknown, UpdateDebtInputType>
// ): UseMutationOptions<boolean, unknown, UpdateDebtInputType> {
//   return {
//     mutationFn: (data: UpdateDebtInputType) =>
//       DebtsAdapter.getInstance().updateDebt(data),
//     mutationKey: ["update-debt"],
//     ...options,
//     onSuccess: async (...args) => {
//       await queryClient.invalidateQueries({ queryKey: ["debt-list"] });
//       await queryClient.invalidateQueries({ queryKey: ["categories"] });
//       await queryClient.invalidateQueries({ queryKey: ["categories-summary"] });
//       options?.onSuccess?.(...args);
//     },
//   };
// }
