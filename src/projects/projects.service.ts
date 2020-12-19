import { Injectable } from '@nestjs/common';
import { Project, CreateProjectInput } from '../graphql.schema';
import * as Nano from 'nano';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
  private readonly conn = Nano(process.env.DB_HOST_AUTH);
  private readonly db = this.conn.use(process.env.DB_NAME);

  create(project: Project): Promise<Project> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = uuidv4();
        const dataToPersist = { project: { ...project, id }, _id: id };
        await this.db.insert({ ...dataToPersist });
        resolve(dataToPersist.project);
      } catch (error) {
        console.error(error);
        reject({ error, project });
      }
    });
  }

  update(id: string, projectUpdated: CreateProjectInput): Promise<Project> {
    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = <{ _id: string; _rev: string; project: Project }>(
          await this.db.get(id)
        );
        if (!queryResult?.project?.id)
          throw new Error(`The id project ${id} doesn't exist`);
        const dataToPersist = {
          ...queryResult,
          project: { ...queryResult.project, ...projectUpdated },
        };
        await this.db.insert({ ...dataToPersist });
        resolve({ ...dataToPersist.project });
      } catch (error) {
        reject({ error, id });
      }
    });
  }

  findAll(): Promise<Project[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = await this.db.find({
          selector: {},
          fields: ['project'],
          limit: 50
        });
        const projects = (<
          Array<{ _id: string; _rev: string; project: Project }>
        >queryResult.docs).map((item) => item.project);
        resolve(projects);
      } catch (error) {
        reject({ error });
      }
    });
  }

  findOneById(id: string): Promise<Project> {
    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = <{ _id: string; _rev: string; project: Project }>(
          await this.db.get(id)
        );
        resolve(queryResult.project);
      } catch (error) {
        reject({ error, id });
      }
    });
  }

  delete(id: string): Promise<Project> {
    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = <{ _id: string; _rev: string; project: Project }>(
          await this.db.get(id)
        );
        if (!queryResult?.project?.id)
          throw new Error(`The id project ${id} doesn't exist`);
        await this.db.destroy(id, queryResult?._rev);
        resolve(<Project>queryResult?.project);
      } catch (error) {
        reject({ error, id });
      }
    });
  }
}
