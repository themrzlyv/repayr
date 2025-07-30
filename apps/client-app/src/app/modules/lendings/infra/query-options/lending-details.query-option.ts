import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/app/shared/data/query-keys";
import { LendingAdapter } from "../lending.adapter";

export function debtDetailsQueryOption(debtId: string) {
  return queryOptions({
    queryKey: [queryKeys.LENDING_DETAILS, debtId],
    queryFn: () => LendingAdapter.getInstance().getLendingDetails(debtId),
  });
}
