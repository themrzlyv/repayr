import { AccountRoleEnum } from "../../domain/enums/account-role.enum";

export type AccountResponseType = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: AccountRoleEnum;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};
