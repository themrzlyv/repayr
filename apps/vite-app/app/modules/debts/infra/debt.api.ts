import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "@src/lib/custom-fetch-base-query";

import {
  CreateDebtFormType,
  UpdateDebtFormType,
} from "../interface/data/form-schema";
import { DebtEntity } from "../domain/entities/debt.entity";

export const debtApi = createApi({
  reducerPath: "debtApi",
  baseQuery: customFetchBaseQuery({
    baseUrl: "http://localhost:8000",
    credentials: "include",
  }),
  tagTypes: ["DebtsList"],
  endpoints: (builder) => ({
    createDebt: builder.mutation<boolean, CreateDebtFormType>({
      query: (data) => ({
        url: "/debt/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DebtsList"],
    }),

    getAllDebts: builder.query<{ debts: DebtEntity[] }, string>({
      query: () => ({
        url: "/debt/all",
        method: "GET",
      }),
      providesTags: ["DebtsList"],
    }),

    getDebtDetails: builder.query<{ Debt: DebtEntity }, string>({
      query: (id) => ({
        url: `/debt/${id}`,
        method: "GET",
      }),
    }),

    updateDebt: builder.mutation<boolean, UpdateDebtFormType>({
      query: (data) => ({
        url: `/debt/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["DebtsList"],
    }),

    removeDebt: builder.mutation<void, string>({
      query: (id) => ({
        url: `/debt/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DebtsList"],
    }),
  }),
});

export const {
  useCreateDebtMutation,
  useGetAllDebtsQuery,
  useGetDebtDetailsQuery,
  useUpdateDebtMutation,
  useRemoveDebtMutation,
} = debtApi;
