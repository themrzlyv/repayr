import type { NotificationTypeEnum } from "../enums/notification-type.enum";
import type { NotificationPayloadValueObject } from "../value-objects/notification-payload.value-object";

export type NotificationEntity = {
  id: string;
  actorId: string;
  paymentId: string | null;
  transactionId: string;
  type: NotificationTypeEnum;
  userId: string;
  data: NotificationPayloadValueObject;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};
