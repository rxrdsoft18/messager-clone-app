import { Module } from '@nestjs/common';
import { RedisService } from '@app/shared/services/redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const REDIS_URI = configService.get('REDIS_URI');
        return {
          ttl: 60000,
          store: 'redis',
          url: REDIS_URI,
        };
      },
    }),
  ],
  controllers: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
