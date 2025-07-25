import type { AmountEntity } from "../../domain/entities/amount.entity";

export type UpdateDebtInputType = {
  id: string;
  name: string | undefined;
  description?: string;
  amount: AmountEntity;
  categoryId: string;
  payDate: Date;
  lenderId: string | undefined;
};
