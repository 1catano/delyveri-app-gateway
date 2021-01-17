import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Project } from '../graphql.schema';
import { ProjectsGuard } from './projects.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { ClientProxy } from '@nestjs/microservices';

const pubSub = new PubSub();

@Resolver('Project')
export class ProjectsResolvers {
  constructor(@Inject('PROJECTS_SERVICE') private client: ClientProxy) {}

  @Query()
  @UseGuards(ProjectsGuard)
  async getProjects() {
    return this.client.send({ cmd: 'get_all_projects' }, '');
  }

  @Query('project')
  async findOneById(
    @Args('id')
    id: string,
  ): Promise<Project> {
    return <Project>this.client.send({ cmd: 'get_project_by_id' }, id);
  }

  @Mutation('createProject')
  async create(
    @Args('createProjectInput') args: CreateProjectDto,
  ): Promise<Project> {
    const createdProject = await (<Project>(
      this.client.send({ cmd: 'create_project' }, args)
    ));
    pubSub.publish('projectCreated', { projectCreated: createdProject });
    return createdProject;
  }

  @Mutation('updateProject')
  async update(
    @Args('id') id: string,
    @Args('updateProjectInput') args: CreateProjectDto,
  ): Promise<Project> {
    const updatedProject = await (<Project>(
      this.client.send({ cmd: 'update_project' }, { id, args })
    ));
    pubSub.publish('projectCreated', { projectCreated: updatedProject });
    return updatedProject;
  }

  @Mutation('deleteProject')
  async delete(@Args('id') id: string): Promise<Project> {
    const deletedProject = await (<Project>(
      this.client.send({ cmd: 'delete_project' }, id)
    ));
    return deletedProject;
  }

  @Subscription('projectCreated')
  projectCreated() {
    return pubSub.asyncIterator('ProjectCreated');
  }
}
