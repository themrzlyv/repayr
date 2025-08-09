import type { AccountEntity } from "@/app/modules/account/domain/entities/account.entity";

export type LendingEntity = {
  id: string;
  lender: Partial<AccountEntity>;
  counterparty: Partial<AccountEntity>;
  createdAt: string;
  updatedAt: string;
};
