import type { CategoryDetailsResponseType } from "@/app/modules/category/infra/types/category.response";

import type { AccountEntity } from "@/app/modules/account/domain/entities/account.entity";
import type { AmountEntity } from "@/app/modules/debts/domain/entities/amount.entity";
import type { DebtStatusEnum } from "@/app/modules/debts/domain/enums/debt-status.enum";
import type { PaymentEntity } from "@/app/modules/debts/domain/entities/payment.entity";

export type LendingDetailsResponseType = {
  id: string;
  name: string;
  description: string;
  amount: AmountEntity;
  categoryId: string;
  status: DebtStatusEnum;
  category: CategoryDetailsResponseType;
  payDate: string;
  userId: string;
  updatedAt: string;
  payments: PaymentEntity[];
  totalPayments: AmountEntity;
  lending: {
    user: Partial<AccountEntity>;
  };
};
