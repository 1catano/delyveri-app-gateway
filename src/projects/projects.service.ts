import { Injectable } from '@nestjs/common';
import { Project } from '../graphql.schema';
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
                await this.db.put({ ...project, _id: id });
                resolve(project);
            } catch (error) {
                reject({ error, project });
            }
        });
    }

    findAll(): Promise<Project[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const docs = this.db.allDocs({ include_docs: true, descending: true });
                const projects = (await docs).rows.map((item) => <Project>{ ...item });
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
}
