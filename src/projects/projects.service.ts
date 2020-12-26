import { Injectable } from '@nestjs/common';
import { Project } from '../graphql.schema';
import { AbstractDao } from 'src/core/dao/abstract-dao';
import { DAO } from 'src/core/dao/dao.contract';

@Injectable()
export class ProjectsService
  extends AbstractDao<Project, string>
  implements DAO<Project, string> {
  constructor() {
    super('project');
  }
}
