import type { CategoryEntity } from "@/app/modules/category/domain/entities/category.entity";
import type { TransactionStatusEnum } from "../enums/transaction-status.enum";
import type { TransactionTypeEnum } from "../enums/transaction-type.enum";
import type { AmountEntity } from "@/app/modules/transactions/domain/entities/amount.entity";
import type { AccountEntity } from "@/app/modules/account/domain/entities/account.entity";
import type { DebtEntity } from "@/app/modules/debts/domain/entities/debt.entity";
import type { LendingEntity } from "@/app/modules/lendings/domain/entities/lending.entity";

export type TransactionEntity = {
  id: string;
  name: string | null;
  description: string | null;
  status: TransactionStatusEnum;
  dueDate: string;
  type: TransactionTypeEnum;
  category: Omit<CategoryEntity, "debts" | "createdAt" | "updatedAt">;
  amount: AmountEntity;
  owner: Omit<AccountEntity, "role" | "currency" | "createdAt" | "updatedAt">;
  approver: Omit<AccountEntity, "role" | "currency" | "createdAt" | "updatedAt"> | null;
  initiator: Omit<AccountEntity, "role" | "currency" | "createdAt" | "updatedAt">;
  debt: DebtEntity | null;
  lending: LendingEntity | null;
  totalPayments: AmountEntity | null;
};
