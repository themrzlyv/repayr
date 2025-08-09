import type { CurrencyEnum } from "@/app/modules/transactions/domain/enums/currency.enum";
import type { AccountRoleEnum } from "../enums/account-role.enum";

export type AccountEntity = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tagName: string;
  role: AccountRoleEnum;
  currency: CurrencyEnum;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};
