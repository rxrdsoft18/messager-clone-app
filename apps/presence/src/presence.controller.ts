import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { PresenceService } from './presence.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { RedisService } from '@app/shared/services/redis.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
@UseInterceptors(CacheInterceptor)
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,

    private readonly redisService: RedisService,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  async getUsers(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    const resultCached = await this.redisService.get('get-presence');
    console.log(resultCached, 'resultCached');
    if (resultCached) {
      console.log('resultCached');
      return resultCached;
    }
    const result = this.presenceService.getPresence();
    await this.redisService.set('get-presence', { t: result });

    return result;
  }

  @MessagePattern({ cmd: 'get-online-user' })
  async getOnlineUser(
    @Ctx() context: RmqContext,
    @Payload() payload: { id: number },
  ) {
    this.sharedService.acknowledgeMessage(context);

    return await this.presenceService.getOnlineUser(payload.id);
  }
}
