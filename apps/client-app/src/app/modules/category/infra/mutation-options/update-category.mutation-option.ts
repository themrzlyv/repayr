import type { UseMutationOptions } from "@tanstack/react-query";
import { CategoryAdapter } from "../category.adapter";
import { queryClient } from "@/app/lib/query-client";
import type { UpdateCategoryFormSchemaType } from "../../interface/schema/update-category-form.schema";

export function updateCategorMutationOption(
  options?: UseMutationOptions<boolean, unknown, UpdateCategoryFormSchemaType>
): UseMutationOptions<boolean, unknown, UpdateCategoryFormSchemaType> {
  return {
    mutationFn: (data: UpdateCategoryFormSchemaType) =>
      CategoryAdapter.getInstance().updateCategory(data),
    mutationKey: ["update-category"],
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(...args);
    },
    ...options,
  };
}
