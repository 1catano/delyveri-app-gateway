import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ProjectsModule } from './projects/projects.module';
import { DatasourceModule } from './datasource/datasource.module';

const AppModules = [DatasourceModule, ProjectsModule];
@Module({
  imports: [
    ...AppModules,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      uploads: {
        maxFileSize: 20000000, // 20 MB
        maxFiles: 5,
      },
    }),
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
