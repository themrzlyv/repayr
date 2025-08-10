import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JwtTokenService } from '@/src/modules/jwt-token/jwt-token.service';

@WebSocketGateway({
  namespace: '/realtime',
  cors: { origin: true, credentials: true },
})
@Injectable()
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly jwtToken: JwtTokenService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string;
      if (!token) return client.disconnect();

      const payload = await this.jwtToken.verifyAccessToken(token);
      const userId = payload.sub;
      if (!userId) return client.disconnect();

      client.data.userId = userId;
      client.join(`user:${userId}`);
    } catch {
      client.disconnect();
    }
  }

  emitToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
