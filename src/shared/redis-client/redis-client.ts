import * as redis from 'redis';
import { promisify } from 'util';

export class RedisClient {
  private _client;
  private _getItem;
  private _setItem;
  private _getList;

  constructor(config: any) {
    this._client = redis.createClient(config);
    this._setItem = promisify(this._client.set).bind(this._client);
    this._getItem = promisify(this._client.get).bind(this._client);
    this._getList = promisify(this._client.lrange).bind(this._client);
  }
  get setItem() {
    return this._setItem;
  }
  get getItem() {
    return this._getItem;
  }
  get getList() {
    return this._getList;
  }
  get client() {
    return this._client;
  }
}
