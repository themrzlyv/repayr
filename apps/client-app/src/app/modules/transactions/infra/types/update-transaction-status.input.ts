import type { ConfirmableTransactionStatusEnum } from "../../domain/enums/confirmable-transaction-status.enum";

export type UpdateTransactionStatusInputType = {
  status: ConfirmableTransactionStatusEnum;
  transactionId: string;
};
