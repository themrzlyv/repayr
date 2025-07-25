import { Amount, Debt } from '@/prisma/generated';

export type DebtEntity = Debt & {
  payments: { amount: Amount }[];
  amount: Amount;
};

export type DebtWithTotals = DebtEntity & {
  totalPayments: Omit<Amount, 'id' | 'debtId' | 'paymentId' | 'lendingId'>;
};
