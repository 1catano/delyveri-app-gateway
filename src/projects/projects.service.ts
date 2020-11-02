import { Injectable } from '@nestjs/common';
import { Project, CreateProjectInput } from '../graphql.schema';
import * as PouchDB from 'pouchdb';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
    private readonly db = new PouchDB('delyveriDB');

    create(project: Project): Promise<Project> {
        return new Promise(async (resolve, reject) => {
            try {
                const id = uuidv4();
                project.id = id;
                await this.db.post({ ...project, _id: id });
                resolve(project);
            } catch (error) {
                reject({ error, project });
            }
        });
    }

    update(id: string, projectUpdated: CreateProjectInput): Promise<Project> {
        return new Promise(async (resolve, reject) => {
            try {
                const project = await this.db.get(id);
                if (!project) throw new Error(`The id project ${id} doesn't exist`);
                await this.db.put({ ...project, ...projectUpdated });
                resolve({ ...projectUpdated, id });
            } catch (error) {
                reject({ error, id });
            }
        });
    }

    findAll(): Promise<Project[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const docs = this.db.allDocs({ include_docs: true, descending: true });
                const projects = (await docs).rows.map((item) => <Project>{ ...item?.doc });
                resolve(projects);
            } catch (error) {
                reject({ error });
            }
        });
    }

    findOneById(id: string): Promise<Project> {
        return new Promise(async (resolve, reject) => {
            try {
                const project = <Project>await this.db.get(id);
                resolve(project);
            } catch (error) {
                reject({ error, id });
            }
        });
    }

    delete(id: string): Promise<Project> {
        return new Promise(async (resolve, reject) => {
            try {
                const project = await this.db.get(id);
                if (!project) throw new Error(`The id project ${id} doesn't exist`);
                await this.db.remove({ ...project });
                resolve(<Project>project);
            } catch (error) {
                reject({ error, id });
            }
        });
    }
}
