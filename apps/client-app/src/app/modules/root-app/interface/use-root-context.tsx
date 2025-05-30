import { SessionAction } from "./actions/session.action";
import { SessionStore } from "./store/session.store";

export function useRootContext() {
  const sessionStore = SessionStore.getInstance();
  const sessionAction = SessionAction.getInstance();
  return {
    sessionAction,
    sessionStore: sessionStore.use(state => state),
  };
}
