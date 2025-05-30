import type { AccountEntity } from "../../domain/entities/account.entity";
import type { AccountResponseType } from "../types/account.response";

export function accountInfoMapper(
  response: AccountResponseType,
): AccountEntity {
  const result = {
    id: response.id,
    email: response.email,
    firstName: response.first_name,
    lastName: response.last_name,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    avatar: response.avatar,
    phone: response.phone,
    role: response.role,
  };

  return result;
}
