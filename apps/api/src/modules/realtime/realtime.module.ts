import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationWsBridge } from './notification-ws.bridge';
import { JwtTokenModule } from '@/src/modules/jwt-token/jwt-token.module';

@Module({
  imports: [JwtTokenModule],
  providers: [NotificationGateway, NotificationWsBridge],
  exports: [NotificationGateway],
})
export class RealtimeModule {}
