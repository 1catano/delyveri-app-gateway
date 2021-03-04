import { Module } from '@nestjs/common';
import { ProjectsResolvers } from './projects.resolver';
import { KafkaClient } from 'src/shared/kafka-client/kafka-client';

@Module({
  providers: [ProjectsResolvers, KafkaClient],
})
export class ProjectsModule {}
