import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { promisify } from 'util';
import * as fs from 'fs';

@Injectable()
export class KafkaClient {
  private _readFile = promisify(fs.readFile);
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafkaSample',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'delyveri-projects-consumer', // Should be the same thing we give in consumer
      },
    },
  })
  private _client: ClientKafka;

  async initializeSubscriptions(key: string) {
    const rawTopcis = (
      await this._readFile('./config/topics.json')
    ).toString('utf8');
    const topics = JSON.parse(rawTopcis);
    const group = topics[key];
    if (!group) return; 
    group.forEach((topic) => {
      console.log('\nTHE TOPIC IS: ', topic);
      this._client.subscribeToResponseOf(topic);
    });
    await this._client.connect();
  }

  get client() {
    return this._client;
  }
}
