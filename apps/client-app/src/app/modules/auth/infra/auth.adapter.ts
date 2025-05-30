import type { SignInFormSchemaType } from "../interface/schema/sign-in-form.schema";
import type { SignInResponse } from "./types/sign-in.response";
import { SessionStorageService } from "@/app/lib/session-storage.service";
import { BaseAdapter } from "@/app/lib/base-adapter";

export class AuthAdapter extends BaseAdapter {
  private static instance: AuthAdapter;

  public static getInstance(): AuthAdapter {
    if (!AuthAdapter.instance) {
      AuthAdapter.instance = new AuthAdapter();
    }
    return AuthAdapter.instance;
  }

  public async signIn(input: SignInFormSchemaType): Promise<SignInResponse> {
    const { data } = await this.httpClient.post<SignInResponse>(
      "/auth/login",
      input
    );
    SessionStorageService.setUserId(data.user.id);
    return data;
  }

  public async signOut() {
    const { data } = await this.httpClient.delete("/auth/logout");
    SessionStorageService.clear();
    return data;
  }
}
