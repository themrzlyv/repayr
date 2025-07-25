import type { AccountEntity } from "../domain/entities/account.entity";
import { BaseAdapter } from "@/app/lib/base-adapter";
import type { UpdateAccountInputType } from "./types/update-account.input";

export class AccountAdapter extends BaseAdapter {
  private static instance: AccountAdapter;

  public static getInstance(): AccountAdapter {
    if (!AccountAdapter.instance) {
      AccountAdapter.instance = new AccountAdapter();
    }
    return AccountAdapter.instance;
  }

  public async getUserInfo(): Promise<AccountEntity> {
    const response = await this.httpClient.get<AccountEntity>("/account/me");
    return response.data;
  }

  public async searchAccount(tagName: string): Promise<AccountEntity[]> {
    const params = new URLSearchParams();
    params.set("tagName", tagName);
    const { data } = await this.httpClient.get<AccountEntity[]>(
      `/account/search?${params.toString()}`
    );

    return data
  }

  public async updateAccount(input: UpdateAccountInputType) {
    const { data } = await this.httpClient.put<boolean>(
      "/account/update",
      input
    );
    return data;
  }
}
