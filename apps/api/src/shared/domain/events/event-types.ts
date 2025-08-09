export const EVENT = {
  PAYMENT_CREATED: 'payment.created',
  TRANSACTION_CREATED: 'transaction.created',
  TRANSACTION_STATUS_CHANGED: 'transaction.status.changed',
} as const;

export type EventName = (typeof EVENT)[keyof typeof EVENT];
