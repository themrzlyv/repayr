import type { CategoryDetailsResponseType } from "@/app/modules/category/infra/types/category.response";
import type { AmountEntity } from "../../domain/entities/amount.entity";
import type { DebtStatusEnum } from "../../domain/enums/debt-status.enum";
import type { PaymentEntity } from "../../domain/entities/payment.entity";
import type { AccountEntity } from "@/app/modules/account/domain/entities/account.entity";

export type DebtDetailsResponseType = {
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
