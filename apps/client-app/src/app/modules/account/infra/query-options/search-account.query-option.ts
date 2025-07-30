import { queryOptions } from "@tanstack/react-query";
import { AccountAdapter } from "../account.adapter";
import { queryKeys } from "@/app/shared/data/query-keys";

export function searchAccountQueryOption(tagName: string) {
  return queryOptions({
    queryKey: [queryKeys.SEARCH_ACCOUNT, tagName],
    queryFn: () => AccountAdapter.getInstance().searchAccount(tagName),
    enabled: !!tagName && tagName.length > 2,
  });
}
