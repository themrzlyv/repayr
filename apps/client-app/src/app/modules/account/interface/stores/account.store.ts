import { BaseStore } from "@/app/lib/base-store";
import { DataState } from "@/app/lib/data-state";
import type { AccountEntity } from "../../domain/entities/account.entity";

type AccountState = {
  accountData: DataState<AccountEntity, string>;
};

export class AccountStore extends BaseStore<AccountState> {
  private static instance: AccountStore;

  private constructor() {
    super(() => ({
      accountData: new DataState<AccountEntity, string>(),
    }));
  }

  public static getInstance(): AccountStore {
    if (!this.instance) {
      this.instance = new AccountStore();
    }
    return this.instance;
  }

  public reset() {
    this.store.setState({
      accountData: new DataState<AccountEntity, string>(),
    });
  }

  public setIsLoading(isLoading: boolean) {
    const accountData = this.store.getState().accountData;
    accountData.setIsLoading(isLoading);
    this.store.setState({ accountData });
  }

  public setError(error: string) {
    const accountData = this.store.getState().accountData;
    accountData.setError(error);
    this.store.setState({ accountData });
  }

  public setAccountData(data?: AccountEntity) {
    const accountData = this.store.getState().accountData;
    accountData.setData(data);
    this.store.setState({ accountData });
  }
}
