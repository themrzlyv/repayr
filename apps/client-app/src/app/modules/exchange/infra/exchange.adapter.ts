import { BaseAdapter } from "@/app/lib/base-adapter";
import type { ExchangeValueInputType } from "./types/exchange-value.input";
import type { ExchangeValue } from "../domain/value-objects/exchange-value.value-object";

export class ExchangeAdapter extends BaseAdapter {
  private static instance: ExchangeAdapter;

  public static getInstance(): ExchangeAdapter {
    if (!ExchangeAdapter.instance) {
      ExchangeAdapter.instance = new ExchangeAdapter();
    }
    return ExchangeAdapter.instance;
  }

  public async exchangeValue(
    input: ExchangeValueInputType
  ): Promise<ExchangeValue> {
    const { data } = await this.httpClient.post<ExchangeValue>(
      "/exchange",
      input
    );
    return data;
  }
}
