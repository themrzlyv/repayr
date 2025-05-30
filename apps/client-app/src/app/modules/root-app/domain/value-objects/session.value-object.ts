import type { SessionMetadataEntity } from "@/app/modules/account/domain/entities/session-metadata.entity";
import type { AccountRoleEnum } from "@/app/modules/account/domain/enums/account-role.enum";

export type SessionValueObject = {
  id: string;
  isAuthenticated: boolean;
  role: AccountRoleEnum;
  userId: string;
  expire: Date;
  metadata: SessionMetadataEntity;
};
