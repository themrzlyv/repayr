import { Body, Controller, Post } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeValueDto } from './dtos/exchange-value.dto';
import { Auth } from '@/src/shared/decorators/auth.decorator';

@Controller('exchange')
@Auth()
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post('')
  public async exchangeValue(@Body() input: ExchangeValueDto) {
    return this.exchangeService.exchangeValue(input);
  }
}
