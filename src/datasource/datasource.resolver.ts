import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { KafkaClient } from '../shared/kafka-client/kafka-client';
import { v4 as uuidv4 } from 'uuid';
import {
  StoreFactory,
  STORE_PROVIDER,
  StoreClient,
} from '../shared/in-memory-store/store.factory';

@Resolver('Datasource')
export class DataSourceResolver {
  private store: StoreClient;
  private channel: any;

  constructor(
    private readonly storeFactory: StoreFactory,
    private readonly kafkaClient: KafkaClient,
  ) {
    this.store = this.storeFactory.initialize(STORE_PROVIDER.REDIS);
    kafkaClient.initializeSubscriptions('datasource');
    this.channel = this.kafkaClient.client;
  }

  @Mutation(() => Boolean)
  async createDatasource(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ): Promise<boolean> {
    const docKey = uuidv4();
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(this.store.createWriteStream(docKey))
        .on('finish', async () => resolve(true))
        .on('error', () => reject(false)),
    );
  }
}
