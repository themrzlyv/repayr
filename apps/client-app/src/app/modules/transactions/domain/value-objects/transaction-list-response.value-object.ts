import type { PaginationValueObject } from "@/app/shared/types/pagination.value-object";
import type { TransactionEntity } from "../entities/transaction.entity";

export type TransactionListResponseValueObject = {
  transactions: TransactionEntity[];
  pagination: PaginationValueObject;
};