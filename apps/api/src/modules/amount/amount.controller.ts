import { Controller } from '@nestjs/common';
import { AmountService } from './amount.service';

@Controller('amount')
export class AmountController {
  constructor(private readonly amountService: AmountService) {}
}
