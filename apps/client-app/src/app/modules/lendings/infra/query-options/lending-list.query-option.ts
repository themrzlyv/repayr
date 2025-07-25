import { queryOptions } from "@tanstack/react-query";
import type { LendingListInputType } from "../types/lending-list.input";
import { LendingAdapter } from "../lending.adapter";

export function lendingListQueryOption({ page, perPage, sort, searchQuery }: LendingListInputType) {
  return queryOptions({
    queryKey: ["lending-list", page, perPage, sort, searchQuery],
    queryFn: () => LendingAdapter.getInstance().getLendingList({ page, perPage, sort, searchQuery }),
    placeholderData: previousData => previousData,
  });
}
