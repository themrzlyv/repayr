import { AccountAdapter } from "../../infra/account.adapter";
import { AccountStore } from "../stores/account.store";

export class AccountAction {
  private static instance: AccountAction;

  readonly accountAdapter = AccountAdapter.getInstance();
  readonly accountStore = AccountStore.getInstance();

  public static getInstance(): AccountAction {
    if (!AccountAction.instance) {
      AccountAction.instance = new AccountAction();
    }
    return AccountAction.instance;
  }

  public async fetchUserInfo() {
    try {
      this.accountStore.setIsLoading(true);
      const res = await this.accountAdapter.getUserInfo();
      this.accountStore.setAccountData(res);
    } catch (error) {
      this.accountStore.setAccountData();
      this.accountStore.setError((error as any)?.message);
    } finally {
      this.accountStore.setIsLoading(false);
    }
  }
}
