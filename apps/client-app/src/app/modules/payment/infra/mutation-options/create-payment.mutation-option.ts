import type { UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/app/lib/query-client";
import type { CreatePaymentInputType } from "../types/create-payment.input";
import { PaymentAdapter } from "../payment.adapter";

export function createPaymentMutationOption(
  options?: UseMutationOptions<boolean, unknown, CreatePaymentInputType>
): UseMutationOptions<boolean, unknown, CreatePaymentInputType> {
  return {
    mutationFn: (data: CreatePaymentInputType) =>
      PaymentAdapter.getInstance().createPayment(data),
    mutationKey: ["create-payment"],
    ...options,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ["transaction-list"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await queryClient.invalidateQueries({ queryKey: ["categories-summary"] });
      options?.onSuccess?.(...args);
    },
  };
}
