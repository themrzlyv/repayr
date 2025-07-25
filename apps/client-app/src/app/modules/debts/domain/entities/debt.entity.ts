import type { CategoryEntity } from "@/app/modules/category/domain/entities/category.entity";
import type { AmountEntity } from "./amount.entity";
import type { DebtStatusEnum } from "../enums/debt-status.enum";
import type { PaymentEntity } from "./payment.entity";
import type { AccountEntity } from "@/app/modules/account/domain/entities/account.entity";

export type DebtEntity = {
  id: string;
  name: string;
  description: string;
  amount: AmountEntity;
  status: DebtStatusEnum;
  category?: Omit<CategoryEntity, "createdAt" | "updatedAt" | "debts">;
  payments: PaymentEntity[];
  totalPayments: AmountEntity;
  payDate: Date;
  lending: {
    user: Partial<AccountEntity>;
  };
};
