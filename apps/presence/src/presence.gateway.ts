import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '@app/shared/services/redis.service';
import { Server, Socket } from 'socket.io';
import { firstValueFrom } from 'rxjs';
import { OnlineUser } from './interfaces/active-user.interface';
import { UserJwt } from '@app/shared';

@WebSocketGateway({ cors: true })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  @WebSocketServer()
  server: Server;

  async onModuleInit() {
    await this.redisService.reset();
  }

  private async getFriends(userId: number) {
    const ob$ = this.authService.send(
      {
        cmd: 'get-friends-list',
      },
      {
        userId,
      },
    );

    return await firstValueFrom(ob$).catch((err) => console.error(err));
  }

  private async emitStatusToFriends(onlineUser: OnlineUser) {
    const friends = await this.getFriends(onlineUser.id);

    for (const f of friends) {
      const user = await this.redisService.get(`user ${f.id}`);

      if (!user) continue;

      const friend = user as OnlineUser;

      this.server.to(friend.socketId).emit('friendOnline', {
        id: onlineUser.id,
        isOnline: onlineUser.isOnline,
      });

      if (onlineUser.isOnline) {
        this.server.to(onlineUser.socketId).emit('friendOnline', {
          id: friend.id,
          isOnline: friend.isOnline,
        });
      }
    }
  }

  private async setOnlineStatus(socket: Socket, isOnline: boolean) {
    const user = socket.data?.user;

    if (!user) return;

    const onlineUser: OnlineUser = {
      id: user.id,
      socketId: socket.id,
      isOnline,
    };

    await this.redisService.set(`user ${user.id}`, onlineUser);
    await this.emitStatusToFriends(onlineUser);
  }

  async handleConnection(socket: Socket) {
    console.log('HANDLE CONNECTION');

    const jwt = socket.handshake.headers.authorization ?? null;

    if (!jwt) {
      await this.handleDisconnect(socket);
      return;
    }

    const ob$ = this.authService.send<UserJwt>({ cmd: 'decode-jwt' }, { jwt });
    const res = await firstValueFrom(ob$).catch((err) => console.error(err));

    if (!res || !res?.user) {
      await this.handleDisconnect(socket);
      return;
    }

    const { user } = res;

    socket.data.user = user;

    await this.setOnlineStatus(socket, true);
  }

  async handleDisconnect(socket: Socket) {
    console.log('HANDLE DISCONNECT');

    await this.setOnlineStatus(socket, false);
  }

  @SubscribeMessage('updateOnlineStatus')
  async updateOnlineStatus(socket: Socket, isOnline: boolean) {
    if (!socket.data?.user) return;

    await this.setOnlineStatus(socket, isOnline);
  }
}
