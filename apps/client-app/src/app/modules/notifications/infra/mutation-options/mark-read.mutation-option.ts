import type { UseMutationOptions } from "@tanstack/react-query";
import { queryClient } from "@/app/lib/query-client";
import { queryKeys } from "@/app/shared/data/query-keys";
import { NotificationsAdapter } from "../notifications.adapter";

export function markReadMutationOption(
  options?: UseMutationOptions<boolean, unknown, string>
): UseMutationOptions<boolean, unknown, string> {
  return {
    mutationFn: (id: string) =>
      NotificationsAdapter.getInstance().markRead(id),
    mutationKey: ["mark-read"],
    ...options,

    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.NOTIFICATION_LIST],
      });
      options?.onSuccess?.(...args);
    },
  };
}
