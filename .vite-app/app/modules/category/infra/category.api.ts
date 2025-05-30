import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "@src/lib/custom-fetch-base-query";

import { CategoryEntity } from "../domain/entities/category.entity";

import { CategoryFormType } from "./types/category-form-type";
import { UpdateCategoryInput } from "./types/update-category-input";
import { CategoryQueries } from "./types/category-queries";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: customFetchBaseQuery(),
  tagTypes: ["CategoryList"],
  endpoints: (builder) => ({
    createCategory: builder.mutation<boolean, CategoryFormType>({
      query: (data) => ({
        url: "/category/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CategoryList"],
    }),

    getCategories: builder.query<
      { categories: CategoryEntity[] },
      CategoryQueries
    >({
      query: ({ select }) => ({
        url: "/category",
        method: "GET",
        params: { select },
      }),
      providesTags: ["CategoryList"],
    }),

    getCategoryDetails: builder.query<{ category: CategoryEntity }, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
    }),

    updateCategory: builder.mutation<boolean, UpdateCategoryInput>({
      query: (data) => ({
        url: `/category/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CategoryList"],
    }),

    removeCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CategoryList"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryDetailsQuery,
  useUpdateCategoryMutation,
  useRemoveCategoryMutation,
} = categoryApi;
