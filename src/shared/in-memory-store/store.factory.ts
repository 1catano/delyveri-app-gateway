import { Injectable } from '@nestjs/common';
import { RedisClient } from '../redis-client/redis-client';
import * as redisWStream from 'redis-wstream';
export enum STORE_PROVIDER {
  REDIS,
}

export type StoreClient = {
  set?: any;
  get?: any;
  getList?: any;
  createWriteStream?: any;
};

@Injectable()
export class StoreFactory {
  initialize(provider: number): StoreClient {
    switch (provider) {
      case STORE_PROVIDER.REDIS: {
        const instance = new RedisClient({ return_buffers: true });
        const client: StoreClient = {
          get: instance.getItem,
          set: instance.setItem,
          getList: instance.getList,
          createWriteStream: (docKey) => redisWStream(instance.client, docKey),
        };
        return client;
      }
      default: {
        const redisClient = new RedisClient({ return_buffers: true });
        const client: StoreClient = {
          get: redisClient.getItem,
          set: redisClient.setItem,
          getList: redisClient.getList,
        };
        return client;
      }
    }
  }
}
