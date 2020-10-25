import { Injectable } from '@nestjs/common';
import { Project } from '../graphql.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
    private readonly projects: Project[] = [{
        id: "4e2bb892-e100-4f39-bc9e-c9cf8f10937d",
        name: 'My first project',
        description: 'My first project description',
        version: '1.1.0',
        lifeCycle: 'draft'
    }];

    create(project: Project): Project {
        project.id = uuidv4();
        this.projects.push(project);
        return project;
    }

    findAll(): Project[] {
        return this.projects;
    }

    findOneById(id: String): Project {
        return this.projects.find(project => project.id === id);
    }
}
