import { ForbiddenException } from '@nestjs/common';
import { Prisma } from '@/prisma/generated';
import { TRANSACTION_WITH_LINK_SELECT } from '../selects';

type TxShape = Prisma.TransactionGetPayload<{
  select: typeof TRANSACTION_WITH_LINK_SELECT;
}>;

export function assertCanSeeTransaction(userId: string, tx: TxShape) {
  const canSee =
    tx.owner.id === userId ||
    tx.debt?.borrower?.id === userId ||
    tx.lending?.lender?.id === userId;

  if (!canSee)
    throw new ForbiddenException('Access denied to this transaction');
}
