import { Prisma } from '@/prisma/generated';

export const BASE_ACCOUNT_SELECT = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
  tagName: true,
  phone: true,
  email: true,
});

export const BASE_AMOUNT_SELECT = Prisma.validator<Prisma.AmountSelect>()({
  currency: true,
  value: true,
  id: true,
});

export const BASE_CATEGORY_SELECT = Prisma.validator<Prisma.CategorySelect>()({
  id: true,
  title: true,
  icon: true,
  type: true,
  userId: true,
});

export const BASE_PAYMENT_SELECT = Prisma.validator<Prisma.PaymentSelect>()({
  id: true,
  amount: { select: BASE_AMOUNT_SELECT },
  createdAt: true,
});

export const BASE_DEBT_SELECT = Prisma.validator<Prisma.DebtSelect>()({
  id: true,
  createdAt: true,
  payments: { select: BASE_PAYMENT_SELECT },
  counterparty: { select: BASE_ACCOUNT_SELECT },
  borrower: { select: BASE_ACCOUNT_SELECT },
});

export const BASE_LENDING_SELECT = Prisma.validator<Prisma.LendingSelect>()({
  id: true,
  createdAt: true,
  counterparty: { select: BASE_ACCOUNT_SELECT },
  lender: { select: BASE_ACCOUNT_SELECT },
});

export const BASE_TRANSACTION_SELECT =
  Prisma.validator<Prisma.TransactionSelect>()({
    id: true,
    name: true,
    description: true,
    type: true,
    status: true,
    dueDate: true,
    createdAt: true,
    amount: {
      select: BASE_AMOUNT_SELECT,
    },
    category: {
      select: BASE_CATEGORY_SELECT,
    },
    debt: {
      select: BASE_DEBT_SELECT,
    },
    lending: {
      select: BASE_LENDING_SELECT,
    },
    owner: {
      select: BASE_ACCOUNT_SELECT,
    },
    approver: {
      select: BASE_ACCOUNT_SELECT,
    },
  });
