import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string) {
    console.log('RedisService.get()', key);
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: unknown) {
    console.log('RedisService.set()', key, value);
    return await this.cacheManager.set(key, value);
  }

  async del(key: string) {
    console.log('RedisService.del()', key);
    return await this.cacheManager.del(key);
  }

  async reset() {
    console.log('RedisService.reset()');
    return await this.cacheManager.reset();
  }
}
