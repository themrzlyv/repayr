import { queryOptions } from "@tanstack/react-query";
import { AccountAdapter } from "../account.adapter";

export function searchAccountQueryOption(tagName: string) {
  return queryOptions({
    queryKey: ["search-account", tagName],
    queryFn: () => AccountAdapter.getInstance().searchAccount(tagName),
    enabled: !!tagName && tagName.length > 2,
  });
}
