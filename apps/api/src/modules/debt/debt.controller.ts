import { Controller } from '@nestjs/common';

import { DebtService } from './debt.service';
import { Auth } from '@/src/shared/decorators/auth.decorator';

@Controller('debt')
@Auth()
export class DebtController {
  constructor(private readonly debtService: DebtService) {}
}
