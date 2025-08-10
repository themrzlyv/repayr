import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/app/shared/data/query-keys";
import { NotificationsAdapter } from "../notifications.adapter";

export function unreadNotificationQueryOption() {
  return queryOptions({
    queryKey: [queryKeys.NOTIFICATION_UNREAD],
    queryFn: () => NotificationsAdapter.getInstance().getUnreadCount(),
    staleTime: 10_000,
    placeholderData: prev => prev,
  });
}
