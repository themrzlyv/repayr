import type { PaymentEntity } from "@/app/modules/payment/domain/entities/payment.entity";
import type { TransactionStatusEnum } from "@/app/modules/transactions/domain/enums/transaction-status.enum";
import type { TransactionTypeEnum } from "@/app/modules/transactions/domain/enums/transaction-type.enum";

export type NotificationPayloadValueObject = {
  name: string;
  avatar: string;
  type: TransactionTypeEnum;
  transactionStatus: TransactionStatusEnum;
  payment: PaymentEntity | null;
};
