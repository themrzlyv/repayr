import { AccountAction } from "./actions/account.action";
import { AccountStore } from "./stores/account.store";

export function useAccountContext() {
  const accountStore = AccountStore.getInstance();
  const accountAction = AccountAction.getInstance();
  return {
    accountAction,
    accountStore: accountStore.use(state => state),
  };
}
