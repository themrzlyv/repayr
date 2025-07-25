import type { AmountEntity } from "@/app/modules/debts/domain/entities/amount.entity";

export type CreatePaymentInputType = {
  amount: AmountEntity;
  debt_id: string;
};
