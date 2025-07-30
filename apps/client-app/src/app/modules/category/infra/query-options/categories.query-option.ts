import { queryOptions } from "@tanstack/react-query";
import { CategoryAdapter } from "../category.adapter";
import type { CategoryListQueryInput } from "../types/category-list-query.input";
import { queryKeys } from "@/app/shared/data/query-keys";

export function categoriesQueryOption(params: CategoryListQueryInput) {
  return queryOptions({
    queryKey: [queryKeys.CATEGORIES, params.filter],
    queryFn: () => CategoryAdapter.getInstance().getCategories(params),
    placeholderData: previousData => previousData,
  });
}
