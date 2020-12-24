export interface DAO<T, E> {
    create(payload: T): Promise<T>;
    update(id: E, payload: T): Promise<T>;
    findById(id: E): Promise<T>;
    findAll(): Promise<T[]>;
    delete(id: E): Promise<T>;
}
