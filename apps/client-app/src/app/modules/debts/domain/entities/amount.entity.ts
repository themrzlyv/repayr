import type { CurrencyEnum } from "../enums/currency.enum";

export type AmountEntity = {
  value: number;
  currency: CurrencyEnum;
};
