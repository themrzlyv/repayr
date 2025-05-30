import { createApi } from "@reduxjs/toolkit/query/react";

import { customFetchBaseQuery } from "~/lib/custom-fetch-base-query";
import {
  setToken,
  clearToken,
} from "~/modules/root-app/interface/store/token.slice";
import { SessionValueObject } from "../domain/value-objects/session.value-object";

export const sessionApi = createApi({
  reducerPath: "sessionApi",
  baseQuery: customFetchBaseQuery(),
  tagTypes: ["SessionList"],
  endpoints: (builder) => ({
    verifySession: builder.query<
      { session: SessionValueObject; csrfToken: string },
      void
    >({
      query: () => ({
        url: "/session",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setToken({ csrfToken: data.csrfToken }));
        } catch {
          dispatch(clearToken());
        }
      },
    }),

    getSessions: builder.query<{ sessions: SessionValueObject[] }, void>({
      query: () => ({
        url: "/session/user-sessions",
        method: "GET",
      }),
      providesTags: ["SessionList"],
    }),

    deleteSession: builder.mutation<void, string>({
      query: (id) => ({
        url: `/session/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SessionList"],
    }),
  }),
});

export const {
  useLazyVerifySessionQuery,
  useVerifySessionQuery,
  useGetSessionsQuery,
  useDeleteSessionMutation,
} = sessionApi;
