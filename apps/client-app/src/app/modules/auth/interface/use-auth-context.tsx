import { AuthAction } from "./actions/auth.action";
import { AuthStore } from "./stores/auth.store";

export function useAuthContext() {
  const authStore = AuthStore.getInstance();
  const authAction = AuthAction.getInstance();
  return {
    authAction,
    authStore: authStore.use(state => state),
  };
}
