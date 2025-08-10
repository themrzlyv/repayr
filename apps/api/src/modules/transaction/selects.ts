import { Prisma } from '@/prisma/generated';
import { BASE_TRANSACTION_SELECT as BASE } from '@/src/shared/data/prisma-selects';

export const BASE_TRANSACTION_SELECT = {
  ...BASE,
} satisfies Prisma.TransactionSelect;

export const TRANSACTION_WITH_LINK_SELECT = {
  ...BASE_TRANSACTION_SELECT,
  linkedTransaction: {
    select: {
      ...BASE_TRANSACTION_SELECT,
      linkedTransaction: undefined,
    },
  },
} satisfies Prisma.TransactionSelect;
