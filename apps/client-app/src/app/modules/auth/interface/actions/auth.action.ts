import { router } from "@/app/lib/base-router";
import { AuthAdapter } from "../../infra/auth.adapter";
import type { SignInFormSchemaType } from "../schema/sign-in-form.schema";
import { AuthStore } from "../stores/auth.store";
import { AccountStore } from "@/app/modules/account/interface/stores/account.store";
import { SessionStore } from "@/app/modules/root-app/interface/store/session.store";
import { SessionAction } from "@/app/modules/root-app/interface/actions/session.action";

export class AuthAction {
  private static instance: AuthAction;

  readonly authAdapter = AuthAdapter.getInstance();
  readonly authStore = AuthStore.getInstance();
  readonly accountStore = AccountStore.getInstance();

  readonly sessionAction = SessionAction.getInstance();
  readonly sessionStore = SessionStore.getInstance();

  public static getInstance(): AuthAction {
    if (!AuthAction.instance) {
      AuthAction.instance = new AuthAction();
    }
    return AuthAction.instance;
  }

  public async signIn(input: SignInFormSchemaType) {
    try {
      this.authStore.setIsLoading(true);
      const res = await this.authAdapter.signIn(input);
      this.authStore.setSignInData(res);
      await this.sessionAction.fetchSession();
      await router.navigate({ to: "/account/dashboard" });
    } catch (error) {
      this.authStore.setError((error as any)?.message);
    } finally {
      this.authStore.setIsLoading(false);
    }
  }

  public async logout() {
    try {
      this.authStore.setIsLoading(true);
      await this.authAdapter.signOut();
      this.authStore.reset();
      this.accountStore.reset();
      this.sessionStore.reset();
      router.navigate({ to: "/sign-in" });
    } catch (error) {
      this.authStore.setError((error as any)?.message);
    } finally {
      this.authStore.setIsLoading(false);
    }
  }
}
