import { queryOptions } from "@tanstack/react-query";
import type { LendingListInputType } from "../types/lending-list.input";
import { LendingAdapter } from "../lending.adapter";
import { queryKeys } from "@/app/shared/data/query-keys";

export function lendingListQueryOption({
  page,
  perPage,
  sort,
  searchQuery,
}: LendingListInputType) {
  return queryOptions({
    queryKey: [queryKeys.LENDING_LIST, page, perPage, sort, searchQuery],
    queryFn: () =>
      LendingAdapter.getInstance().getLendingList({
        page,
        perPage,
        sort,
        searchQuery,
      }),
    placeholderData: previousData => previousData,
  });
}
