import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { SharedModule } from '@app/shared';
import { RedisModule } from '@app/shared/modules/redis.module';

@Module({
  imports: [SharedModule, RedisModule],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
