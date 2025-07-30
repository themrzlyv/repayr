import { queryOptions } from "@tanstack/react-query";
import { AuthAdapter } from "../auth.adapter";
import { useAuthStore } from "../../interface/stores/use-auth.store";
import { queryKeys } from "@/app/shared/data/query-keys";

export function refreshTokenQueryOption() {
  return queryOptions({
    queryKey: [queryKeys.REFRESH_TOKEN],
    queryFn: async () => {
      const data = await AuthAdapter.getInstance().refreshAccessToken();
      useAuthStore.getState().setAcessToken({ accessToken: data.accessToken });
      return data;
    },
  });
}
