import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Auth } from '@/src/shared/decorators/auth.decorator';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { RequestUser } from '@/src/shared/decorators/request-user.decorator';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';
import { UpdateTransactionStatusDto } from './dtos/update-transaction-status.dto';
import { GetTransactionsDto } from './dtos/get-transactions.dto';
import { TransactionQueryService } from './services/transaction.query.service';
import { TransactionMutationService } from './services/transaction.mutation.service';

@Controller('transaction')
@Auth()
export class TransactionController {
  constructor(
    private readonly transactionQueryService: TransactionQueryService,
    private readonly transactionMutationService: TransactionMutationService,
  ) {}

  @Get('')
  public async getUserTransactions(
    @RequestUser() user: RequestUserEntity,
    @Query() query: GetTransactionsDto,
  ) {
    return this.transactionQueryService.getUserTransactions(user.id, query);
  }

  @Get(':id')
  public async getTransactionDetails(
    @RequestUser() user: RequestUserEntity,
    @Param('id') transactionId: string,
  ) {
    return this.transactionQueryService.getTransactionById(user, transactionId);
  }

  @Post('create')
  public async createTransaction(
    @RequestUser() user: RequestUserEntity,
    @Body() input: CreateTransactionDto,
  ) {
    return this.transactionMutationService.createTransaction(user, input);
  }

  @Put('update-status')
  public async updateTransactionStatus(
    @RequestUser() user: RequestUserEntity,
    @Body() input: UpdateTransactionStatusDto,
  ) {
    return this.transactionMutationService.updateTransactionStatus(user, input);
  }
}
