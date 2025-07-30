import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

import { CreatePaymentInput } from './inputs/create-payment.input';
import { Auth } from '@/src/shared/decorators/auth.decorator';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';
import { RequestUser } from '@/src/shared/decorators/request-user.decorator';

@Controller('payment')
@Auth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  public async createPayment(
    @Body() input: CreatePaymentInput,
    @RequestUser() user: RequestUserEntity,
  ) {
    return this.paymentService.createPayment(input, user.id);
  }
}
