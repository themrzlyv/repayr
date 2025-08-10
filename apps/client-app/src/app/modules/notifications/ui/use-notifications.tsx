import { useCallback, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationListQueryOption } from "@/app/modules/notifications/infra/query-options/notification-list.query-option";
import { unreadNotificationQueryOption } from "@/app/modules/notifications/infra/query-options/unread-notification.query-option";
import { markReadMutationOption } from "@/app/modules/notifications/infra/mutation-options/mark-read.mutation-option";
import type { NotificationEntity } from "@/app/modules/notifications/domain/entities/notification.entity";
import { NotificationType } from "@/app/modules/notifications/domain/enums/notification-type.enum";

type UseNotificationsArgs = { page?: number; limit?: number };

export function useNotifications({
  page = 1,
  limit = 5,
}: UseNotificationsArgs = {}) {
  const { data: notificationData } = useQuery(
    notificationListQueryOption({ page, limit })
  );
  const { data: unread } = useQuery(unreadNotificationQueryOption());
  const { mutateAsync: markRead } = useMutation(markReadMutationOption());

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(v => !v);

  const renderMessage = useCallback((n: NotificationEntity) => {
    switch (n.type) {
      case NotificationType.TRANSACTION_PAID:
        return (
          <span>
            <span className="font-semibold">{n.data?.name} </span>
            has paid your transaction (ID: `{n.transactionId}`)
          </span>
        );
      case NotificationType.TRANSACTION_CREATED:
        return (
          <span>
            <span className="font-semibold capitalize">{n.data?.name} </span>
            has created a new{" "}
            <span className="font-semibold capitalize">
              {n.data?.type.toLowerCase()}
            </span>{" "}
            transaction for you.
          </span>
        );
      case NotificationType.TRANSACTION_ACCEPTED:
        return (
          <span>
            <span className="font-semibold capitalize">{n.data?.name} </span>
            has approved your{" "}
            <span className="font-semibold capitalize">
              {n.data?.type.toLowerCase()}
            </span>{" "}
            transaction
          </span>
        );
      case NotificationType.TRANSACTION_REJECTED:
        return (
          <span>
            <span className="font-semibold">{n.data?.name} </span>
            has rejected your transaction (ID: `{n.transactionId}`)
          </span>
        );
      case NotificationType.PAYMENT_ADDED:
        return (
          <span>
            <span className="font-semibold">{n.data?.name} </span>
            has added{" "}
            {`${n.data?.payment?.amount.value} ${n.data?.payment?.amount.currency}`}{" "}
            payment to your transaction
          </span>
        );
      default:
        return null;
    }
  }, []);

  return {
    notifications: notificationData?.notifications ?? [],
    unreadCount: unread?.count ?? 0,
    isOpen,
    toggle,
    markRead,
    renderMessage,
  };
}
