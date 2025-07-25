import type { UseMutationOptions } from "@tanstack/react-query";
import { CategoryAdapter } from "../category.adapter";
import { queryClient } from "@/app/lib/query-client";
import type { CreateCategoryFormSchemaType } from "../../interface/schema/create-category-form.schema";

export function createCategorMutationOption(
  options?: UseMutationOptions<boolean, unknown, CreateCategoryFormSchemaType>
): UseMutationOptions<boolean, unknown, CreateCategoryFormSchemaType> {
  return {
    mutationFn: (data: CreateCategoryFormSchemaType) =>
      CategoryAdapter.getInstance().createCategory(data),
    mutationKey: ["create-category"],
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  };
}
