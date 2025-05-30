import type { AccountResponseType } from "./types/account.response";
import { accountInfoMapper } from "./mappers/account-info.mapper";
import type { AccountEntity } from "../domain/entities/account.entity";
import { BaseAdapter } from "@/app/lib/base-adapter";

export class AccountAdapter extends BaseAdapter {
  private static instance: AccountAdapter;

  public static getInstance(): AccountAdapter {
    if (!AccountAdapter.instance) {
      AccountAdapter.instance = new AccountAdapter();
    }
    return AccountAdapter.instance;
  }

  public async getUserInfo(): Promise<AccountEntity> {
    const response = await this.httpClient.get<AccountResponseType>("/account/me");
    return accountInfoMapper(response.data);
  }
}
