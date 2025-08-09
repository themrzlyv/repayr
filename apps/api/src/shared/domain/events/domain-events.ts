import { BaseEvent } from './base-event';
import { EVENT } from './event-types';
import {
  PaymentCreatedPayload,
  TransactionCreatedPayload,
  TransactionStatusChangedPayload,
} from './event-payloads';

export type PaymentCreatedEvent = BaseEvent<
  typeof EVENT.PAYMENT_CREATED,
  PaymentCreatedPayload
>;
export type TransactionCreatedEvent = BaseEvent<
  typeof EVENT.TRANSACTION_CREATED,
  TransactionCreatedPayload
>;
export type TransactionStatusChangedEvent = BaseEvent<
  typeof EVENT.TRANSACTION_STATUS_CHANGED,
  TransactionStatusChangedPayload
>;
