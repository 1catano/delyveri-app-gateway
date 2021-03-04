
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateProjectInput {
    name?: string;
    description?: string;
    version?: string;
    lifeCycle?: string;
}

export abstract class IMutation {
    abstract createDatasource(file: Upload): Upload | Promise<Upload>;

    abstract createProject(createProjectInput?: CreateProjectInput): Project | Promise<Project>;

    abstract updateProject(id: string, updateProjectInput?: CreateProjectInput): Project | Promise<Project>;

    abstract deleteProject(id: string): Project | Promise<Project>;
}

export abstract class IQuery {
    abstract getProjects(): Project[] | Promise<Project[]>;

    abstract project(id: string): Project | Promise<Project>;
}

export abstract class ISubscription {
    abstract projectCreated(): Project | Promise<Project>;
}

export class Project {
    id?: string;
    name?: string;
    description?: string;
    version?: string;
    lifeCycle?: string;
}

export type Upload = any;
