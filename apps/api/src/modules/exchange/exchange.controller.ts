import { Body, Controller, Post } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeValueInput } from './inputs/exchange-value.input';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post('')
  public async exchangeValue(@Body() input: ExchangeValueInput) {
    return this.exchangeService.exchangeValue(input);
  }
}
