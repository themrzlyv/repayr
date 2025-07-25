import type { AmountEntity } from "../../domain/entities/amount.entity";

export type CreateDebtInputType = {
  name: string | undefined;
  description?: string;
  amount: AmountEntity;
  categoryId: string;
  payDate: Date;
  lenderId: string | undefined;
};
