import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { API_URL, skip401endpoints } from "./constants";

import { openModal } from "~/shared/components/modal/modal.slice";
import { RootState } from "./store";

export const customFetchBaseQuery = (): BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const csrfToken = state.token.csrfToken;

      if (csrfToken) {
        headers.set("x-csrf-token", csrfToken);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    const skip401 = skip401endpoints.some(
      (endpoint) => api.endpoint === endpoint,
    );

    if (
      result &&
      "error" in result &&
      result.error?.status === 401 &&
      !skip401
    ) {
      api.dispatch(
        openModal({
          title: "Session expired",
          content: "Please log in again.",
          intent: "logout",
        }),
      );
    }

    return result;
  };
};
