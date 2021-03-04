import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Project } from '../graphql.schema';
import { ProjectsGuard } from './projects.guard';
import { KafkaClient } from '../shared/kafka-client/kafka-client';
import { CreateProjectDto } from './dto/create-project.dto';

const pubSub = new PubSub();

@Resolver('Project')
export class ProjectsResolvers {
  private channel: any;
  constructor(private readonly kafkaClient: KafkaClient) {
    kafkaClient.initializeSubscriptions('projects');
    this.channel = this.kafkaClient.client;
  }

  @Query()
  @UseGuards(ProjectsGuard)
  async getProjects(): Promise<Array<Project>> {
    const projects: Array<Project> = [];
    (await this.channel.send('projects-get-all', '')).forEach((item) => {
      projects[projects.length] = <Project>item;
    });
    return projects;
  }

  @Mutation('createProject')
  async create(
    @Args('createProjectInput') args: CreateProjectDto,
  ): Promise<Project> {
    const createdProject = await (<Project>(
      this.channel.send('projects-exec-create', args)
    ));
    pubSub.publish('projectCreated', { projectCreated: createdProject });
    return createdProject;
  }

  @Query('project')
  async findOneById(
    @Args('id')
    id: string,
  ): Promise<Project> {
    return <Project>this.channel.send('projects-get-project', id);
  }

  @Mutation('updateProject')
  async update(
    @Args('id') id: string,
    @Args('updateProjectInput') project: CreateProjectDto,
  ): Promise<Project> {
    const updatedProject = await (<Project>(
      this.channel.send('projects-exec-update', { id, project })
    ));
    pubSub.publish('projectCreated', { projectCreated: updatedProject });
    return updatedProject;
  }

  @Mutation('deleteProject')
  async delete(@Args('id') id: string): Promise<Project> {
    const deletedProject = await (<Project>(
      this.channel.send('projects-exec-delete', id)
    ));
    return deletedProject;
  }

  @Subscription('projectCreated')
  projectCreated() {
    return pubSub.asyncIterator('ProjectCreated');
  }
}
