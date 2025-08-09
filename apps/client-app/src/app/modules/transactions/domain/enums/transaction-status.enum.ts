export const TransactionStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;

export type TransactionStatusEnum =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];