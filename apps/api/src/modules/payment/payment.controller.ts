import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SessionAuthGuard } from '@/src/shared/guards/session-auth.guard';
import { CsrfGuard } from '@/src/shared/guards/csrf.guard';
import { RolesGuard } from '@/src/shared/guards/roles.guard';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import { Session } from 'express-session';
import { CreatePaymentInput } from './inputs/create-payment.input';

@Controller('payment')
@UseGuards(SessionAuthGuard, CsrfGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  public async createPayment(
    @Body() input: CreatePaymentInput,
    @Authorized() session: Session,
  ) {
    return this.paymentService.createPayment(input, session.user.id);
  }
}
