import { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../modules/auth/interface/stores/use-auth.store";
import { queryKeys } from "../shared/data/query-keys";

const openQueryKeys = new Set<string>([queryKeys.REFRESH_TOKEN]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: false,
      enabled: ({ queryKey }) => {
        const accessToken = useAuthStore.getState().accessToken;
        return openQueryKeys.has(queryKey[0] as string) || !!accessToken;
      },
    },
  },
});
