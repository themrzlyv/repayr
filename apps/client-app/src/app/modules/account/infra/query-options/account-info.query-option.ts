import { queryOptions } from "@tanstack/react-query";
import { AccountAdapter } from "../account.adapter";

export function accountInfoQueryOption() {
  return queryOptions({
    queryKey: ["accountInfo"],
    queryFn: () => AccountAdapter.getInstance().getUserInfo(),
  });
}
