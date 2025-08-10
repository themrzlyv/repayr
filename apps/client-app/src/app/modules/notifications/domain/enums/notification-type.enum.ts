export const NotificationType = {
  TRANSACTION_CREATED: "TRANSACTION_CREATED",
  TRANSACTION_ACCEPTED: "TRANSACTION_ACCEPTED",
  TRANSACTION_REJECTED: "TRANSACTION_REJECTED",
  PAYMENT_ADDED: "PAYMENT_ADDED",
  TRANSACTION_PAID: "TRANSACTION_PAID",
} as const;

export type NotificationTypeEnum =
  (typeof NotificationType)[keyof typeof NotificationType];
