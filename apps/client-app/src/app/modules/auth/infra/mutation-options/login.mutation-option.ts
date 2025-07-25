import type { UseMutationOptions } from "@tanstack/react-query";
import { AuthAdapter } from "../auth.adapter";
import type { SignInFormSchemaType } from "../../interface/schema/sign-in-form.schema";
import type { SignInResponse } from "../types/sign-in.response";
import { router } from "@/app/lib/base-router";

export function loginMutationOption(
  options?: UseMutationOptions<SignInResponse, unknown, SignInFormSchemaType>
): UseMutationOptions<SignInResponse, unknown, SignInFormSchemaType> {
  return {
    mutationFn: (data: SignInFormSchemaType) =>
      AuthAdapter.getInstance().signIn(data),
    mutationKey: ["sign-in"],
    onSuccess: () => router.navigate({ to: "/account/dashboard" }),
    ...options,
  };
}
