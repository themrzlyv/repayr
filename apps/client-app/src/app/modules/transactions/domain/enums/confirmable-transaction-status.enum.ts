import type { TransactionStatusEnum } from "./transaction-status.enum";

export type ConfirmableTransactionStatusEnum = Extract<
  TransactionStatusEnum,
  "ACCEPTED" | "REJECTED"
>;
