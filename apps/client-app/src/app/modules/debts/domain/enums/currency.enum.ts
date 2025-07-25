export const Currency = {
  AZN: "AZN",
  EUR: "EUR",
  USD: "USD",
} as const;

export type CurrencyEnum = (typeof Currency)[keyof typeof Currency];
