import type { AccountEntity } from "@/app/modules/account/domain/entities/account.entity";
import type { AmountEntity } from "../../../transactions/domain/entities/amount.entity";
import type { PaymentEntity } from "../../../payment/domain/entities/payment.entity";

export type DebtEntity = {
  id: string;
  borrower: Partial<AccountEntity>;
  counterparty: Partial<AccountEntity>;
  createdAt: string;
  updatedAt: string;
  payments: PaymentEntity[];
  totalPayments: AmountEntity;
};
