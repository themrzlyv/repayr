import { SessionAdapter } from "../../infra/session.adapter";
import { SessionStore } from "../store/session.store";

export class SessionAction {
  private static instance: SessionAction;

  readonly sessionAdapter = SessionAdapter.getInstance();
  readonly sessionStore = SessionStore.getInstance();

  public static getInstance(): SessionAction {
    if (!SessionAction.instance) {
      SessionAction.instance = new SessionAction();
    }
    return SessionAction.instance;
  }

  public async initialVerifySession() {
    try {
      this.sessionStore.setIsLoading(true);
      const response = await this.sessionAdapter.verifySession();
      this.sessionStore.setSession(response);
    } catch (error) {
      this.sessionStore.reset();
      this.sessionStore.setError((error as any)?.message);
    } finally {
      this.sessionStore.setIsLoading(false);
    }
  }

  public async fetchSession() {
    this.sessionStore.setIsLoading(false);
    try {
      const response = await this.sessionAdapter.verifySession();
      this.sessionStore.setSession(response);
    } catch (error) {
      this.sessionStore.reset();
      this.sessionStore.setError((error as any)?.message);
    }
  }
}
