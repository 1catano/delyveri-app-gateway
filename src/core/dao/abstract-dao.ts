import { DAO } from './dao.contract';
import * as Nano from 'nano';
import { v4 as uuidv4 } from 'uuid';

export abstract class AbstractDao<T, E> implements DAO<T, E> {
  private readonly conn = Nano(process.env.DB_HOST_AUTH);
  private db: any;
  private documentName: string;

  constructor(documentName: string, dbName?: string) {
    this.documentName = documentName;
    this.initDatabase(dbName || process.env.DB_NAME);
  }

  private initDatabase(dbName: string) {
    this.conn.db.list().then(async (dbList) => {
      try {
        if (!dbList.includes(dbName)) {
          // create a new DB if database doesn't exist.
          await this.conn.db.create(dbName);
          const db = this.conn.use(dbName);
          console.log('database created successfully');
          this.db = db;
        } else {
          const db = this.conn.use(dbName);
          console.log('connected to database successfully');
          this.db = db;
        }
      } catch (err) {
        throw new Error(err);
      }
    });
  }

  create(payload: T): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = uuidv4();
        const dataToPersist = { _id: id };
        dataToPersist[this.documentName] = { ...payload, id };
        await this.db.insert({ ...dataToPersist });
        resolve(<T>{ ...payload, id });
      } catch (error) {
        console.error(error);
        reject({ error, payload });
      }
    });
  }

  update(id: E, payload: T): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = await this.db.get(id.toString());
        if (!queryResult[this.documentName]?.id)
          throw new Error(
            `The id ${id} in the entity ${this.documentName} doesn't exist`,
          );
        const dataToPersist = { ...queryResult };
        dataToPersist[this.documentName] = {
          ...queryResult[this.documentName],
          ...payload,
        };
        await this.db.insert({ ...dataToPersist });
        resolve(<T>{ ...dataToPersist[this.documentName] });
      } catch (error) {
        console.error(error);
        reject({ error, id });
      }
    });
  }

  findById(id: E): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = await this.db.get(id.toString());
        if (!queryResult[this.documentName]?.id)
          throw new Error(
            `The id ${id} in the entity ${this.documentName} doesn't exist`,
          );
        resolve(<T>{ ...queryResult[this.documentName] });
      } catch (error) {
        console.error(error);
        reject({ error, id });
      }
    });
  }

  findAll(): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = await this.db.find({
          selector: {},
          fields: [this.documentName],
          limit: 50,
        });
        const items = queryResult.docs.map((item) => item[this.documentName]);
        resolve(<T[]>items);
      } catch (error) {
        console.error(error);
        reject({ error });
      }
    });
  }

  delete(id: E): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = await this.db.get(id.toString());
        if (!queryResult[this.documentName]?.id)
          throw new Error(
            `The id ${id} in the entity ${this.documentName} doesn't exist`,
          );
        await this.db.destroy(id.toString(), queryResult?._rev);
        resolve(<T>queryResult[this.documentName]);
      } catch (error) {
        console.error(error);
        reject({ error, id });
      }
    });
  }
}
