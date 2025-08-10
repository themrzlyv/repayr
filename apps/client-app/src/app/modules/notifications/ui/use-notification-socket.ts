import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { destroySocket, getSocketOrNull, initSocket } from "@/app/lib/socket";
import { queryKeys } from "@/app/shared/data/query-keys";
import type { NotificationEntity } from "@/app/modules/notifications/domain/entities/notification.entity";
import type { NotificationListResponseValueObject } from "@/app/modules/notifications/domain/value-objects/notification-list-response.value-object";
import { useAuthStore } from "../../auth/interface/stores/use-auth.store";

type Props = {
  page?: number;
  limit?: number;
};

export function useNotificationSocket({ page = 1, limit = 10 }: Props) {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (accessToken) {
      initSocket(accessToken);
    } else {
      destroySocket();
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const socket = getSocketOrNull();
    if (!socket) return;

    const onCreated = (notif: NotificationEntity) => {
      const key = [queryKeys.NOTIFICATION_LIST, page, limit];
      const notificationsCache = queryClient.getQueryData(key);

      if (!notificationsCache) {
        queryClient.invalidateQueries({
          queryKey: [queryKeys.NOTIFICATION_LIST],
        });
        return;
      }

      queryClient.setQueryData<NotificationListResponseValueObject>(
        key,
        old => {
          if (!old) return old;
          return {
            ...old,
            notifications: [notif, ...(old.notifications ?? [])],
            pagination: {
              ...old.pagination,
              total: (old.pagination?.total ?? 0) + 1,
            },
          };
        }
      );
    };

    const onUnread = ({ count }: { count: number }) => {
      queryClient.setQueryData<{ count: number }>(
        [queryKeys.NOTIFICATION_UNREAD],
        { count }
      );
    };

    if (socket.connected) {
      socket.on("notification.created", onCreated);
      socket.on("notification.unread", onUnread);
    } else {
      const attachAfterConnect = () => {
        socket.on("notification.created", onCreated);
        socket.on("notification.unread", onUnread);
      };
      socket.once("connect", attachAfterConnect);

      return () => {
        socket.off("notification.created", onCreated);
        socket.off("notification.unread", onUnread);
        socket.off("connect", attachAfterConnect);
      };
    }

    return () => {
      socket.off("notification.created", onCreated);
      socket.off("notification.unread", onUnread);
    };
  }, [queryClient, accessToken, page, limit]);
}
