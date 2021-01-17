import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ProjectsModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
    }),
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
