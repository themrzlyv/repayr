import type { UseMutationOptions } from "@tanstack/react-query";
import { AuthAdapter } from "../auth.adapter";
import { router } from "@/app/lib/base-router";
import { useAuthStore } from "../../interface/stores/use-auth.store";
import { queryClient } from "@/app/lib/query-client";

export function logoutMutationOption(
  options?: UseMutationOptions
): UseMutationOptions {
  return {
    mutationKey: ["logout"],
    mutationFn: () => AuthAdapter.getInstance().signOut(),
    onSuccess: async () => {
      useAuthStore.getState().setAcessToken({ accessToken: null });
      router.navigate({ to: "/sign-in" });
      await queryClient.resetQueries();
    },
    ...options,
  };
}
