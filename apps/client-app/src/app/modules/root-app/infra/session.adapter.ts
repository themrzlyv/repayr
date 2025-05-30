import type { VerifySessionResponse } from "./types/verify-session.response";
import { BaseAdapter } from "@/app/lib/base-adapter";
import { SessionStorageService } from "@/app/lib/session-storage.service";

export class SessionAdapter extends BaseAdapter {
  private static instance: SessionAdapter;

  public static getInstance(): SessionAdapter {
    if (!SessionAdapter.instance) {
      SessionAdapter.instance = new SessionAdapter();
    }
    return SessionAdapter.instance;
  }

  public async verifySession(): Promise<VerifySessionResponse> {
    try {
      const { data } =
        await this.httpClient.get<VerifySessionResponse>("/session");
      return data;
    } catch (error) {
      SessionStorageService.clear();
      return Promise.reject(error);
    }
  }
}
