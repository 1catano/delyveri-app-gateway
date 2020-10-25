import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsResolvers } from './projects.resolver';

@Module({
    providers: [ProjectsService, ProjectsResolvers],
})
export class ProjectsModule { }
