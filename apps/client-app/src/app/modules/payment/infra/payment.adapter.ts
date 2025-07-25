import { BaseAdapter } from "@/app/lib/base-adapter";
import type { CreatePaymentInputType } from "./types/create-payment.input";

export class PaymentAdapter extends BaseAdapter {
  private static instance: PaymentAdapter;

  public static getInstance(): PaymentAdapter {
    if (!PaymentAdapter.instance) {
      PaymentAdapter.instance = new PaymentAdapter();
    }
    return PaymentAdapter.instance;
  }

  public async createPayment(input: CreatePaymentInputType): Promise<boolean> {
    const { data } = await this.httpClient.post<boolean>(
      "/payment/create",
      input
    );
    return data;
  }
}
