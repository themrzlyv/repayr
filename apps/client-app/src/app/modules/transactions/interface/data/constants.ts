import { TransactionType, type TransactionTypeEnum } from "../../domain/enums/transaction-type.enum";

export const typeFieldMap: Record<TransactionTypeEnum, "debt" | "lending"> = {
  [TransactionType.DEBT]: "debt",
  [TransactionType.LENDING]: "lending",
};
