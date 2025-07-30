import type { UseMutationOptions } from "@tanstack/react-query";
import { AuthAdapter } from "../auth.adapter";
import type { SignInFormSchemaType } from "../../interface/schema/sign-in-form.schema";
import type { SignInResponse } from "../types/sign-in.response";
import { router } from "@/app/lib/base-router";
import { useAuthStore } from "../../interface/stores/use-auth.store";

export function loginMutationOption(
  options?: UseMutationOptions<SignInResponse, unknown, SignInFormSchemaType>
): UseMutationOptions<SignInResponse, unknown, SignInFormSchemaType> {
  return {
    mutationFn: (data: SignInFormSchemaType) =>
      AuthAdapter.getInstance().signIn(data),
    mutationKey: ["sign-in"],
    ...options,
    onSuccess: async (...args) => {
      const { setAcessToken } = useAuthStore.getState();
      setAcessToken({ accessToken: args[0].accessToken });

      router.navigate({ to: "/account/dashboard" });
      options?.onSuccess?.(...args);
    },
  };
}
