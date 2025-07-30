import { queryOptions } from "@tanstack/react-query";
import { AccountAdapter } from "../account.adapter";
import { queryKeys } from "@/app/shared/data/query-keys";

export function accountInfoQueryOption() {
  return queryOptions({
    queryKey: [queryKeys.ACCOUNT_INFO],
    queryFn: () => AccountAdapter.getInstance().getUserInfo(),
  });
}
