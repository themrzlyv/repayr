import type { UseMutationOptions } from "@tanstack/react-query";
import type { ExchangeValueInputType } from "../types/exchange-value.input";
import { ExchangeAdapter } from "../exchange.adapter";
import type { ExchangeValue } from "../../domain/value-objects/exchange-value.value-object";

export function exchangeValueMutationOption(
  options?: UseMutationOptions<ExchangeValue, unknown, ExchangeValueInputType>
): UseMutationOptions<ExchangeValue, unknown, ExchangeValueInputType> {
  return {
    mutationFn: (data: ExchangeValueInputType) =>
      ExchangeAdapter.getInstance().exchangeValue(data),
    mutationKey: ["exchange-value"],
    ...options,

    onSuccess: async (...args) => {
      options?.onSuccess?.(...args);
    },
  };
}
