import { queryOptions } from "@tanstack/react-query";
import { CategoryAdapter } from "../category.adapter";
import type { CategoryListQueryInput } from "../types/category-list-query.input";

export function categoriesQueryOption(params: CategoryListQueryInput) {
  return queryOptions({
    queryKey: ["categories", params.filter],
    queryFn: () => CategoryAdapter.getInstance().getCategories(params),
    placeholderData: previousData => previousData,
  });
}
