import { BaseStore } from "@/app/lib/base-store";
import { DataState } from "@/app/lib/data-state";
import type { VerifySessionResponse } from "../../infra/types/verify-session.response";

type SessionState = {
  sessionData: DataState<VerifySessionResponse, string>;
};

export class SessionStore extends BaseStore<SessionState> {
  private static instance: SessionStore;

  private constructor() {
    super(() => ({
      sessionData: new DataState<VerifySessionResponse, string>({ isLoading: true}),
    }));
  }

  public static getInstance(): SessionStore {
    if (!this.instance) {
      this.instance = new SessionStore();
    }
    return this.instance;
  }

  public reset() {
    this.store.setState({
      sessionData: new DataState<VerifySessionResponse, string>(),
    });
  }

  public setIsLoading(isLoading: boolean) {
    const sessionData = this.store.getState().sessionData;
    sessionData.setIsLoading(isLoading);
    this.store.setState({ sessionData });
  }

  public setError(error: string) {
    const sessionData = this.store.getState().sessionData;
    sessionData.setError(error);
    this.store.setState({ sessionData });
  }

  public setSession(data: VerifySessionResponse) {
    const sessionData = this.store.getState().sessionData;
    sessionData.setData(data);
    this.store.setState({ sessionData });
  }
}
