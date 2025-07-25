import { queryOptions } from "@tanstack/react-query";
import { CategoryAdapter } from "../category.adapter";
import type { CurrencyEnum } from "@/app/modules/debts/domain/enums/currency.enum";

export function categoriesSummaryQueryOption() {
  return queryOptions({
    queryKey: ["categories-summary"],
    queryFn: () => CategoryAdapter.getInstance().getCategoriesSummary(),
    placeholderData: previousData => previousData,
  });
}
