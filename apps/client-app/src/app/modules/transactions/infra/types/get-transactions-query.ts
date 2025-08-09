import type { TransactionStatusEnum } from "../../domain/enums/transaction-status.enum";
import type { TransactionTypeEnum } from "../../domain/enums/transaction-type.enum";

export type GetTransactionsQueryType = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: TransactionStatusEnum;
  type?: TransactionTypeEnum;
  searchQuery?: string;
};