export const TransactionType = {
  DEBT: "DEBT",
  LENDING: "LENDING",
} as const;

export type TransactionTypeEnum =
  (typeof TransactionType)[keyof typeof TransactionType];
