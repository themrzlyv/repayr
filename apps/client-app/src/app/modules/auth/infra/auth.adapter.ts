import type { SignInFormSchemaType } from "../interface/schema/sign-in-form.schema";
import type { SignInResponse } from "./types/sign-in.response";
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
    return data;
  }

  public async refreshAccessToken(): Promise<SignInResponse> {
    const { data } = await this.httpClient.get<SignInResponse>("/auth/refresh");
    return data;
  }

  public async signOut() {
    const { data } = await this.httpClient.delete("/auth/logout");
    return data;
  }
}
