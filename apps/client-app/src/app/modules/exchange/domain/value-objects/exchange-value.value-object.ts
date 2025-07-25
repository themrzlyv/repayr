import type { CurrencyEnum } from "@/app/modules/debts/domain/enums/currency.enum"

export type ExchangeValue = {
  currency: CurrencyEnum;
  value: number
}