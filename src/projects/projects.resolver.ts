import { ParseIntPipe, UseGuards } from '@nestjs/common';
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

    @Subscription('projectCreated')
    projectCreated() {
        return pubSub.asyncIterator('ProjectCreated');
    }
}