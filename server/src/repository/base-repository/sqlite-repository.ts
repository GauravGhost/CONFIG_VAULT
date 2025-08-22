import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import type { BaseModel, CreateItem, IRepository } from './types.js';
import { QueryBuilder } from './query-builder.js';

export class SQLiteRepository<T extends BaseModel> implements IRepository<T> {
    protected db: Database | null = null;
    protected tableName: string;
    private static dbInstance: Database | null = null;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    // Singleton database connection
    async initialize(dbPath: string = 'data/database.sqlite'): Promise<void> {
        if (!SQLiteRepository.dbInstance) {
            // Ensure the directory exists
            const dir = dirname(dbPath);
            await mkdir(dir, { recursive: true });
            
            SQLiteRepository.dbInstance = await open({
                filename: dbPath,
                driver: sqlite3.Database
            });

            await SQLiteRepository.dbInstance.exec('PRAGMA foreign_keys = ON');
            await SQLiteRepository.dbInstance.exec('PRAGMA journal_mode = WAL');
        }
        this.db = SQLiteRepository.dbInstance;
    }

    async create(item: CreateItem<T>): Promise<T> {
        if (!this.db) throw new Error('Database not initialized');

        const columns = Object.keys(item);
        const values = Object.values(item);
        const placeholders = new Array(values.length).fill('?').join(', ');

        const result = await this.db.run(
            `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
            values
        );

        const insertedRecord = await this.db.get(
            `SELECT * FROM ${this.tableName} WHERE rowid = ?`,
            [result.lastID]
        );

        if (!insertedRecord) {
            throw new Error('Failed to retrieve inserted record');
        }

        return insertedRecord as T;
    }

    async findById(id: string): Promise<T | null> {
        if (!this.db) throw new Error('Database not initialized');

        const result = await this.db.get(
            `SELECT * FROM ${this.tableName} WHERE id = ?`,
            [id]
        );

        return result as T || null;
    }

    async findAll(limit?: number, offset: number = 0): Promise<T[]> {
        if (!this.db) throw new Error('Database not initialized');

        let query = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`;
        const params: any[] = [];

        if (limit) {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const results = await this.db.all(query, params);
        return results as T[];
    }

    async findBy(criteria: Partial<T>, limit?: number, offset: number = 0): Promise<T[]> {
        if (!this.db) throw new Error('Database not initialized');

        const { clause, values } = QueryBuilder.buildWhereClause(criteria as Record<string, any>);
        let query = `SELECT * FROM ${this.tableName} ${clause} ORDER BY created_at DESC`;
        const params = [...values];

        if (limit) {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const results = await this.db.all(query, params);
        return results as T[];
    }

    async findOne(criteria: Partial<T>): Promise<T | null> {
        if (!this.db) throw new Error('Database not initialized');

        const { clause, values } = QueryBuilder.buildWhereClause(criteria as Record<string, any>);
        const query = `SELECT * FROM ${this.tableName} ${clause} LIMIT 1`;

        const result = await this.db.get(query, values);
        return result as T || null;
    }

    async update(id: string, item: Partial<CreateItem<T>>): Promise<T> {
        if (!this.db) throw new Error('Database not initialized');

        const { clause, values } = QueryBuilder.buildUpdateClause(item as Record<string, any>);
        
        if (!clause) {
            throw new Error('No fields to update');
        }

        await this.db.run(
            `UPDATE ${this.tableName} SET ${clause} WHERE id = ?`,
            [...values, id]
        );

        const updated = await this.findById(id);
        if (!updated) {
            throw new Error('Record not found after update');
        }

        return updated;
    }

    async delete(id: string): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');

        const result = await this.db.run(
            `DELETE FROM ${this.tableName} WHERE id = ?`,
            [id]
        );

        return result.changes ? result.changes > 0 : false;
    }

    async count(criteria?: Partial<T>): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');

        let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
        let values: any[] = [];

        if (criteria) {
            const { clause, values: whereValues } = QueryBuilder.buildWhereClause(criteria as Record<string, any>);
            query += ` ${clause}`;
            values = whereValues;
        }

        const result = await this.db.get(query, values);
        return result?.count || 0;
    }

    async exists(id: string): Promise<boolean> {
        if (!this.db) throw new Error('Database not initialized');

        const result = await this.db.get(
            `SELECT 1 FROM ${this.tableName} WHERE id = ? LIMIT 1`,
            [id]
        );

        return !!result;
    }

    async createMany(items: CreateItem<T>[]): Promise<T[]> {
        if (!this.db) throw new Error('Database not initialized');
        if (items.length === 0) return [];

        const results: T[] = [];
        
        await this.db.exec('BEGIN TRANSACTION');
        try {
            for (const item of items) {
                const created = await this.create(item);
                results.push(created);
            }
            await this.db.exec('COMMIT');
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error;
        }

        return results;
    }

    async updateMany(criteria: Partial<T>, item: Partial<CreateItem<T>>): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');

        const { clause: whereClause, values: whereValues } = QueryBuilder.buildWhereClause(criteria as Record<string, any>);
        const { clause: setClause, values: setValues } = QueryBuilder.buildUpdateClause(item as Record<string, any>);

        if (!setClause) {
            throw new Error('No fields to update');
        }

        const result = await this.db.run(
            `UPDATE ${this.tableName} SET ${setClause} ${whereClause}`,
            [...setValues, ...whereValues]
        );

        return result.changes || 0;
    }

    async deleteMany(criteria: Partial<T>): Promise<number> {
        if (!this.db) throw new Error('Database not initialized');

        const { clause, values } = QueryBuilder.buildWhereClause(criteria as Record<string, any>);
        
        if (!clause) {
            throw new Error('Cannot delete all records without criteria');
        }

        const result = await this.db.run(
            `DELETE FROM ${this.tableName} ${clause}`,
            values
        );

        return result.changes || 0;
    }

    // Transaction
    async transaction<R>(callback: (repo: SQLiteRepository<T>) => Promise<R>): Promise<R> {
        if (!this.db) throw new Error('Database not initialized');

        await this.db.exec('BEGIN TRANSACTION');
        try {
            const result = await callback(this);
            await this.db.exec('COMMIT');
            return result;
        } catch (error) {
            await this.db.exec('ROLLBACK');
            throw error;
        }
    }

    // Raw query
    async rawQuery(query: string, params: any[] = []): Promise<any[]> {
        if (!this.db) throw new Error('Database not initialized');
        return this.db.all(query, params);
    }

    async rawGet(query: string, params: any[] = []): Promise<any> {
        if (!this.db) throw new Error('Database not initialized');
        return this.db.get(query, params);
    }

    // Close database connection
    static async closeConnection(): Promise<void> {
        if (SQLiteRepository.dbInstance) {
            await SQLiteRepository.dbInstance.close();
            SQLiteRepository.dbInstance = null;
        }
    }
}
