import { queryOptions } from "@tanstack/react-query";
import { CategoryAdapter } from "../category.adapter";
import { queryKeys } from "@/app/shared/data/query-keys";

export function categoriesSummaryQueryOption() {
  return queryOptions({
    queryKey: [queryKeys.CATEGORIES_SUMMARY],
    queryFn: () => CategoryAdapter.getInstance().getCategoriesSummary(),
    placeholderData: previousData => previousData,
  });
}
