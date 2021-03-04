import { Module } from '@nestjs/common';
import { StoreFactory } from 'src/shared/in-memory-store/store.factory';
import { DataSourceResolver } from './datasource.resolver';
import { KafkaClient } from 'src/shared/kafka-client/kafka-client';

@Module({
  providers: [DataSourceResolver, StoreFactory, KafkaClient],
})
export class DatasourceModule {}
