import { create } from "zustand";

type AuthState = {
  accessToken?: string | null;
  setAcessToken: ({ accessToken }: Omit<AuthState, "setAcessToken">) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  setAcessToken: ({ accessToken }: Omit<AuthState, "setAcessToken">) =>
    set({ accessToken }),
}));
