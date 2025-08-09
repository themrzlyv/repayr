import type { AmountEntity } from "@/app/modules/transactions/domain/entities/amount.entity";
import type { TransactionTypeEnum } from "../../domain/enums/transaction-type.enum";

export type CreateTransactionInputType = {
  name?: string;
  counterpartyId?: string;
  description?: string;
  amount: AmountEntity;
  type: TransactionTypeEnum;
  categoryId: string;
  dueDate: Date;
};
