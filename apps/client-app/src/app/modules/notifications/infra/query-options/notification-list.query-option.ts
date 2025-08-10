import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/app/shared/data/query-keys";
import type { GetNotificationsQueryType } from "../types/get-notifications.query";
import { NotificationsAdapter } from "../notifications.adapter";

export function notificationListQueryOption(query: GetNotificationsQueryType) {
  return queryOptions({
    queryKey: [
      queryKeys.NOTIFICATION_LIST,
      ...Object.entries(query).map(([key, value]) => [key, value]),
    ],
    queryFn: () =>
      NotificationsAdapter.getInstance().getNotificationList(query),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
}
