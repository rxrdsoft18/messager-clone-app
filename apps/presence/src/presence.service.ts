import { Injectable } from '@nestjs/common';
import { RedisService } from '@app/shared/services/redis.service';
import { OnlineUser } from './interfaces/active-user.interface';

@Injectable()
export class PresenceService {
  constructor(private readonly redisService: RedisService) {}

  getPresence() {
    return 'Hello World!';
  }
  async getOnlineUser(id: number) {
    const user = await this.redisService.get(`user ${id}`);

    return user as OnlineUser | undefined;
  }
}
