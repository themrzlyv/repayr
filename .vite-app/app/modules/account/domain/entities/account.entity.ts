import { AccountRoleEnum } from "../enums/account-role.enum";

export type AccountEntity = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AccountRoleEnum;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};
