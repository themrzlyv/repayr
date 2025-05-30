import { BaseStore } from "@/app/lib/base-store";
import type { SignInResponse } from "../../infra/types/sign-in.response";
import { DataState } from "@/app/lib/data-state";

type AuthState = {
  signIn: DataState<SignInResponse, string>;
};

export class AuthStore extends BaseStore<AuthState> {
  private static instance: AuthStore;

  private constructor() {
    super(() => ({
      signIn: new DataState<SignInResponse, string>(),
    }));
  }

  public static getInstance(): AuthStore {
    if (!this.instance) {
      this.instance = new AuthStore();
    }
    return this.instance;
  }

  public reset() {
    this.store.setState({ signIn: new DataState<SignInResponse, string>() });
  }

  public setIsLoading(isLoading: boolean) {
    const signIn = this.store.getState().signIn;
    signIn.setIsLoading(isLoading);
    this.store.setState({ signIn });
  }

  public setSignInData(data: SignInResponse) {
    const signIn = this.store.getState().signIn;
    signIn.setData(data);
    this.store.setState({ signIn });
  }

  public setError(error: string) {
    const signIn = this.store.getState().signIn;
    signIn.setError(error);
    this.store.setState({ signIn });
  }
}
