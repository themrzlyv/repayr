import { Status } from '@/prisma/generated';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTransactionStatusDto {
  @IsIn([Status.ACCEPTED, Status.REJECTED])
  @IsNotEmpty()
  status: Extract<Status, 'ACCEPTED' | 'REJECTED'>;

  @IsNotEmpty()
  @IsString()
  transactionId: string;
}
