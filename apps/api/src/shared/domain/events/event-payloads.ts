import { Status } from '@/prisma/generated';

export type PaymentCreatedPayload = {
  paymentId: string;
  debtId: string;
  transactionId: string;
};

export type TransactionCreatedPayload = {
  mainTransactionId: string;
  linkedTransactionId: string;
  approverId: string; // alıcı/karşı taraf
};

export type TransactionStatusChangedPayload = {
  mainTransactionId: string;
  linkedTransactionId: string;
  recipientId: string; // bildirim alacak taraf
  newStatus: Status;
};
