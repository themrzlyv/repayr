import { createApi } from "@reduxjs/toolkit/query/react";

import { accountInfoMapper } from "./mappers/account-info.mapper";

import type { AccountResponseType } from "./types/account.response";
import type { AccountEntity } from "../domain/entities/account.entity";

import { customFetchBaseQuery } from "~/lib/custom-fetch-base-query";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: customFetchBaseQuery(),
  endpoints: (builder) => ({
    me: builder.query<AccountEntity, string>({
      query: () => ({
        url: "/account/me",
        method: "GET",
      }),
      transformResponse: (response: AccountResponseType): AccountEntity =>
        accountInfoMapper(response),
    }),
  }),
});

export const { useMeQuery, useLazyMeQuery } = accountApi;
