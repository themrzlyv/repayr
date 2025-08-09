import type { CurrencyEnum } from "@/app/modules/transactions/domain/enums/currency.enum";

export type ExchangeValue = {
  currency: CurrencyEnum;
  value: number;
};
