import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationGateway } from './notification.gateway';
import { NotificationEventTypeEnum } from '../notification/types/notification-event-type.enum';

@Injectable()
export class NotificationWsBridge {
  constructor(private readonly gw: NotificationGateway) {}

  @OnEvent(NotificationEventTypeEnum.NOTIFICATION_CREATED, { async: true })
  onNotificationCreated(evt: { userId: string; notification: any }) {
    this.gw.emitToUser(
      evt.userId,
      NotificationEventTypeEnum.NOTIFICATION_CREATED,
      evt.notification,
    );
  }

  @OnEvent(NotificationEventTypeEnum.NOTIFICATION_UNREAD, { async: true })
  onUnread(evt: { userId: string; count: number }) {
    this.gw.emitToUser(
      evt.userId,
      NotificationEventTypeEnum.NOTIFICATION_UNREAD,
      { count: evt.count },
    );
  }
}
