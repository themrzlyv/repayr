import { BaseAdapter } from "@/app/lib/base-adapter";
import { DEFAULT_TABLE_PER_PAGE } from "@/app/lib/constants";
import type { GetNotificationsQueryType } from "./types/get-notifications.query";
import type { NotificationEntity } from "../domain/entities/notification.entity";
import type { PaginationValueObject } from "@/app/shared/types/pagination.value-object";
import type { NotificationListResponseValueObject } from "../domain/value-objects/notification-list-response.value-object";

export class NotificationsAdapter extends BaseAdapter {
  private static instance: NotificationsAdapter;

  public static getInstance(): NotificationsAdapter {
    if (!NotificationsAdapter.instance) {
      NotificationsAdapter.instance = new NotificationsAdapter();
    }
    return NotificationsAdapter.instance;
  }

  public async getNotificationList({
    page = 1,
    limit,
  }: GetNotificationsQueryType) {
    const params = new URLSearchParams();

    params.set("page", page.toString());
    params.set("limit", (limit || DEFAULT_TABLE_PER_PAGE).toString());

    const { data } =
      await this.httpClient.get<NotificationListResponseValueObject>(
        `/notification/all?${params.toString()}`
      );

    return {
      pagination: data.pagination,
      notifications: data.notifications,
    };
  }

  public async getUnreadCount(): Promise<{ count: number}> {
    const { data } = await this.httpClient.get<{ count: number}>(
      `/notification/unread`
    );
    return data;
  }

  public async markRead(id: string) {
    const { data } = await this.httpClient.put<boolean>(`/notification/${id}`);
    return data;
  }
}
