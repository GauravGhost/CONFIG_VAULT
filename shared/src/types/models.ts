import { BaseModel } from "../schema";

export type CreateItem<T extends BaseModel> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

export interface IRepository<T extends BaseModel> {
    create(item: CreateItem<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(limit?: number, offset?: number): Promise<T[]>;
    findBy(criteria: Partial<T>, limit?: number, offset?: number): Promise<T[]>;
    findOne(criteria: Partial<T>): Promise<T | null>;
    update(id: string, item: Partial<CreateItem<T>>): Promise<T>;
    delete(id: string): Promise<boolean>;
    count(criteria?: Partial<T>): Promise<number>;
    exists(id: string): Promise<boolean>;
}