import { createApi } from "@reduxjs/toolkit/query/react";

import type { SignInFormSchemaType } from "../interface/schema/sign-in-form.schema";

import type { SignInResponse } from "./types/sign-in.response";

import { customFetchBaseQuery } from "~/lib/custom-fetch-base-query";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customFetchBaseQuery(),
  endpoints: (builder) => ({
    signInUser: builder.mutation<SignInResponse, SignInFormSchemaType>({
      query: (data: SignInFormSchemaType) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.query<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),
  }),
});

export const { useSignInUserMutation, useLazyLogoutQuery } = authApi;
