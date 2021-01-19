import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ProjectsResolvers } from './projects.resolver';

@Module({
  providers: [
    ProjectsResolvers,
    {
      provide: 'PROJECTS_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('PROJECTS_SERVICE_HOST'),
            port: configService.get('PROJECTS_SERVICE_PORT'),
          },
        }),
    },
  ],
  imports: [ConfigModule.forRoot()],
})
export class ProjectsModule {}
