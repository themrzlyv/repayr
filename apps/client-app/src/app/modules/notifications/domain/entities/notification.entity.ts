import type { AmountEntity } from "@/app/modules/transactions/domain/entities/amount.entity";
import type { TransactionTypeEnum } from "@/app/modules/transactions/domain/enums/transaction-type.enum";

export type NotificationEntity = {
  id: string;
  data: {
    name: string;
    avatar: string;
    type: TransactionTypeEnum;
    dueDate: string;
    amount: AmountEntity;
    message: string;
  };
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};
