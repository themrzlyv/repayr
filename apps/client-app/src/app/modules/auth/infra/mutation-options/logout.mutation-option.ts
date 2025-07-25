import type { UseMutationOptions } from "@tanstack/react-query";
import { AuthAdapter } from "../auth.adapter";
import { router } from "@/app/lib/base-router";

export function logoutMutationOption(
  options?: UseMutationOptions
): UseMutationOptions {
  return {
    mutationKey: ["logout"],
    mutationFn: () => AuthAdapter.getInstance().signOut(),
    onSuccess: () => router.navigate({ to: "/sign-in" }),
    ...options,
  };
}
