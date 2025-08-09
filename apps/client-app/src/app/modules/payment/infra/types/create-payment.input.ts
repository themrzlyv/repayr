import type { AmountEntity } from "@/app/modules/transactions/domain/entities/amount.entity";

export type CreatePaymentInputType = {
  amount: AmountEntity;
  debtId: string;
  transactionId: string;
};
