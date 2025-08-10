import type { UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/app/lib/query-client";
import type { CreatePaymentInputType } from "../types/create-payment.input";
import { PaymentAdapter } from "../payment.adapter";
import { queryKeys } from "@/app/shared/data/query-keys";

export function createPaymentMutationOption(
  options?: UseMutationOptions<boolean, unknown, CreatePaymentInputType>
): UseMutationOptions<boolean, unknown, CreatePaymentInputType> {
  return {
    mutationFn: (data: CreatePaymentInputType) =>
      PaymentAdapter.getInstance().createPayment(data),
    mutationKey: ["create-payment"],
    ...options,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.TRANSACTION_LIST],
      });
      await queryClient.invalidateQueries({ queryKey: [queryKeys.CATEGORIES] });
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.CATEGORIES_SUMMARY],
      });
      options?.onSuccess?.(...args);
    },
  };
}
