import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Project } from '../graphql.schema';
import { ProjectsGuard } from './projects.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

const pubSub = new PubSub();

@Resolver('Project')
export class ProjectsResolvers {
    constructor(private readonly projectsService: ProjectsService) { }

    @Query()
    @UseGuards(ProjectsGuard)
    async getProjects() {
        return this.projectsService.findAll();
    }

    @Query('project')
    async findOneById(
        @Args('id')
        id: string,
    ): Promise<Project> {
        return this.projectsService.findOneById(id);
    }

    @Mutation('createProject')
    async create(@Args('createProjectInput') args: CreateProjectDto): Promise<Project> {
        const createdProject = await this.projectsService.create(args);
        pubSub.publish('projectCreated', { projectCreated: createdProject });
        return createdProject;
    }

    @Mutation('updateProject')
    async update(@Args('id') id: string, @Args('updateProjectInput') args: CreateProjectDto): Promise<Project> {
        const updatedProject = await this.projectsService.update(id, args);
        pubSub.publish('projectCreated', { projectCreated: updatedProject });
        return updatedProject;
    }

    @Mutation('deleteProject')
    async delete(@Args('projectId') id: string): Promise<Project> {
        const deletedProject = await this.projectsService.delete(id);
        return deletedProject;
    }

    @Subscription('projectCreated')
    projectCreated() {
        return pubSub.asyncIterator('ProjectCreated');
    }
}