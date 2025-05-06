import { SessionMetadataEntity } from "../entities/session-metadata.entity";
import { AccountRoleEnum } from "../enums/account-role.enum";

export type SessionValueObject = {
  id: string;
  isAuthenticated: boolean;
  role: AccountRoleEnum;
  userId: string;
  expire: Date;
  metadata: SessionMetadataEntity;
};
