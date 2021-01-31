import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Project } from '../graphql.schema';
import { ProjectsGuard } from './projects.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

const pubSub = new PubSub();

@Resolver('Project')
export class ProjectsResolvers {
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
  client: ClientKafka;

  async onModuleInit() {
    const topics = [
      'projects-get-all',
      'projects-exec-create',
      'projects-get-project',
      'projects-exec-update',
      'projects-exec-delete',
    ];
    topics.forEach((topic) => {
      console.log("\nTHE TOPIC IS: ", topic);
      this.client.subscribeToResponseOf(topic);
    });
    await this.client.connect();
  }

  @Query()
  @UseGuards(ProjectsGuard)
  async getProjects() {
    return this.client.send('projects-get-all', '');
  }

  @Mutation('createProject')
  async create(
    @Args('createProjectInput') args: CreateProjectDto,
  ): Promise<Project> {
    const createdProject = await (<Project>(
      this.client.send('projects-exec-create', args)
    ));
    pubSub.publish('projectCreated', { projectCreated: createdProject });
    return createdProject;
  }

  @Query('project')
  async findOneById(
    @Args('id')
    id: string,
  ): Promise<Project> {
    return <Project>this.client.send('projects-get-project', id);
  }

  @Mutation('updateProject')
  async update(
    @Args('id') id: string,
    @Args('updateProjectInput') project: CreateProjectDto,
  ): Promise<Project> {
    const updatedProject = await (<Project>(
      this.client.send('projects-exec-update', { id, project })
    ));
    pubSub.publish('projectCreated', { projectCreated: updatedProject });
    return updatedProject;
  }

  @Mutation('deleteProject')
  async delete(@Args('id') id: string): Promise<Project> {
    const deletedProject = await (<Project>(
      this.client.send('projects-exec-delete', id)
    ));
    return deletedProject;
  }

  @Subscription('projectCreated')
  projectCreated() {
    return pubSub.asyncIterator('ProjectCreated');
  }
}
