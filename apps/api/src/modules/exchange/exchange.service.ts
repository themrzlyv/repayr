import { BadRequestException, Injectable } from '@nestjs/common';
import { ExchangeValueDto } from './dtos/exchange-value.dto';
import { ExchangeValueResponseType } from './types/exchange-value.reponse';

@Injectable()
export class ExchangeService {
  public async exchangeValue({
    from,
    to,
    value,
  }: ExchangeValueDto): Promise<ExchangeValueResponseType> {
    const exchangeRates = await this.getExchangeRates(to);
    const exchangedValue = value * exchangeRates[from.toUpperCase()];

    return {
      value: Number(exchangedValue.toFixed(2)),
      currency: to,
    };
  }

  public async getExchangeRates(
    targetCurrency: string,
  ): Promise<Record<string, number>> {
    if (!targetCurrency) {
      throw new BadRequestException('targetCurrency is required');
    }

    try {
      const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${targetCurrency.toLowerCase()}.json`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Exchange API failed with status ${res.status}`);
      }

      const data = await res.json();

      const ratesFromTargetToOthers = data[targetCurrency.toLowerCase()];
      if (
        !ratesFromTargetToOthers ||
        typeof ratesFromTargetToOthers !== 'object'
      ) {
        throw new Error('Invalid rates object from API');
      }

      const result: Record<string, number> = {};

      for (const [currency, rate] of Object.entries(ratesFromTargetToOthers)) {
        if (typeof rate === 'number' && rate > 0) {
          result[currency.toUpperCase()] = 1 / rate;
        }
      }

      result[targetCurrency.toUpperCase()] = 1;

      return result;
    } catch (err) {
      console.error('Exchange rate fetch failed:', err);
      return {};
    }
  }
}
