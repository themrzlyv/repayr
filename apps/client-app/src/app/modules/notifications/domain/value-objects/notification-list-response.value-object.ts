import type { PaginationValueObject } from "@/app/shared/types/pagination.value-object";
import type { NotificationEntity } from "../entities/notification.entity";

export type NotificationListResponseValueObject = {
  notifications: NotificationEntity[];
  pagination: PaginationValueObject;
};