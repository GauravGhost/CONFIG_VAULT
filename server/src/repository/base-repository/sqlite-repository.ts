import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import { QueryBuilder } from './query-builder.js';
import type { BaseModel, CreateItem, IRepository } from '@config-vault/shared';

export class SQLiteRepository<T extends BaseModel> implements IRepository<T> {
    protected db: Database | null = null;
    protected tableName: string;
    private static dbInstance: Database | null = null;

    constructor(tableName: string) {
        this.tableName = tableName;
        // Auto-connect to singleton if already initialized
        this.connectToSingleton();
    }

    // Connect to singleton database if available
    private connectToSingleton(): void {
        if (SQLiteRepository.dbInstance && !this.db) {
            this.db = SQLiteRepository.dbInstance;
        }
    }

    // Ensure database connection before operations
    private ensureDbConnection(): void {
        if (!this.db) {
            this.connectToSingleton();
        }
        if (!this.db) {
            throw new Error('Database not initialized');
        }
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
        this.ensureDbConnection();

        const columns = Object.keys(item);
        const values = Object.values(item);
        const placeholders = new Array(values.length).fill('?').join(', ');

        const result = await this.db!.run(
            `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
            values
        );

        const insertedRecord = await this.db!.get(
            `SELECT * FROM ${this.tableName} WHERE rowid = ?`,
            [result.lastID]
        );

        if (!insertedRecord) {
            throw new Error('Failed to retrieve inserted record');
        }

        return insertedRecord as T;
    }

    async findById(id: string): Promise<T | null> {
        this.ensureDbConnection();

        const result = await this.db!.get(
            `SELECT * FROM ${this.tableName} WHERE id = ?`,
            [id]
        );

        return result as T || null;
    }

    async findAll(limit?: number, offset: number = 0): Promise<T[]> {
        this.ensureDbConnection();

        let query = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`;
        const params: any[] = [];

        if (limit) {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const results = await this.db!.all(query, params);
        return results as T[];
    }

    async findBy(criteria: Partial<T>, limit?: number, offset: number = 0): Promise<T[]> {
        this.ensureDbConnection();

        const { clause, values } = QueryBuilder.buildWhereClause(criteria as Record<string, any>);
        let query = `SELECT * FROM ${this.tableName} ${clause} ORDER BY created_at DESC`;
        const params = [...values];

        if (limit) {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }

        const results = await this.db!.all(query, params);
        return results as T[];
    }

    async findOne(criteria: Partial<T>): Promise<T | null> {
        this.ensureDbConnection();

        const { clause, values } = QueryBuilder.buildWhereClause(criteria as Record<string, any>);
        const query = `SELECT * FROM ${this.tableName} ${clause} LIMIT 1`;

        const result = await this.db!.get(query, values);
        return result as T || null;
    }

    async update(id: string, item: Partial<CreateItem<T>>): Promise<T> {
        this.ensureDbConnection();

        const { clause, values } = QueryBuilder.buildUpdateClause(item as Record<string, any>);
        
        if (!clause) {
            throw new Error('No fields to update');
        }

        await this.db!.run(
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
        this.ensureDbConnection();

        const result = await this.db!.run(
            `DELETE FROM ${this.tableName} WHERE id = ?`,
            [id]
        );

        return result.changes ? result.changes > 0 : false;
    }

    async count(criteria?: Partial<T>): Promise<number> {
        this.ensureDbConnection();

        let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
        let values: any[] = [];

        if (criteria) {
            const { clause, values: whereValues } = QueryBuilder.buildWhereClause(criteria as Record<string, any>);
            query += ` ${clause}`;
            values = whereValues;
        }

        const result = await this.db!.get(query, values);
        return result?.count || 0;
    }

    async exists(id: string): Promise<boolean> {
        this.ensureDbConnection();

        const result = await this.db!.get(
            `SELECT 1 FROM ${this.tableName} WHERE id = ? LIMIT 1`,
            [id]
        );

        return !!result;
    }

    async createMany(items: CreateItem<T>[]): Promise<T[]> {
        this.ensureDbConnection();
        if (items.length === 0) return [];

        const results: T[] = [];
        
        await this.db!.exec('BEGIN TRANSACTION');
        try {
            for (const item of items) {
                const created = await this.create(item);
                results.push(created);
            }
            await this.db!.exec('COMMIT');
        } catch (error) {
            await this.db!.exec('ROLLBACK');
            throw error;
        }

        return results;
    }

    async updateMany(criteria: Partial<T>, item: Partial<CreateItem<T>>): Promise<number> {
        this.ensureDbConnection();

        const { clause: whereClause, values: whereValues } = QueryBuilder.buildWhereClause(criteria as Record<string, any>);
        const { clause: setClause, values: setValues } = QueryBuilder.buildUpdateClause(item as Record<string, any>);

        if (!setClause) {
            throw new Error('No fields to update');
        }

        const result = await this.db!.run(
            `UPDATE ${this.tableName} SET ${setClause} ${whereClause}`,
            [...setValues, ...whereValues]
        );

        return result.changes || 0;
    }

    async deleteMany(criteria: Partial<T>): Promise<number> {
        this.ensureDbConnection();

        const { clause, values } = QueryBuilder.buildWhereClause(criteria as Record<string, any>);
        
        if (!clause) {
            throw new Error('Cannot delete all records without criteria');
        }

        const result = await this.db!.run(
            `DELETE FROM ${this.tableName} ${clause}`,
            values
        );

        return result.changes || 0;
    }

    // Transaction
    async transaction<R>(callback: (repo: SQLiteRepository<T>) => Promise<R>): Promise<R> {
        this.ensureDbConnection();

        await this.db!.exec('BEGIN TRANSACTION');
        try {
            const result = await callback(this);
            await this.db!.exec('COMMIT');
            return result;
        } catch (error) {
            await this.db!.exec('ROLLBACK');
            throw error;
        }
    }

    // Raw query
    async rawQuery(query: string, params: any[] = []): Promise<any[]> {
        this.ensureDbConnection();
        return this.db!.all(query, params);
    }

    async rawGet(query: string, params: any[] = []): Promise<any> {
        this.ensureDbConnection();
        return this.db!.get(query, params);
    }

    // Find with relations using LEFT JOIN
    async findWithRelations<R = any>(options: {
        relations: Array<{
            table: string;
            alias?: string;
            on: string;
            columns?: string[];
        }>;
        where?: Partial<T>;
        orderBy?: string;
        limit?: number;
        offset?: number;
    }): Promise<R[]> {
        this.ensureDbConnection();

        // Build SELECT clause
        const mainTableColumns = `${this.tableName}.*`;
        const relationColumns = options.relations.map(rel => {
            const alias = rel.alias || rel.table;
            if (rel.columns && rel.columns.length > 0) {
                return rel.columns.map(col => `${alias}.${col} as ${alias}_${col}`).join(', ');
            }
            return `${alias}.*`;
        }).join(', ');

        // Build JOIN clause
        const joinClauses = options.relations.map(rel => {
            const alias = rel.alias || rel.table;
            return `LEFT JOIN ${rel.table} ${alias !== rel.table ? alias : ''} ON ${rel.on}`;
        }).join(' ');

        // Build WHERE clause
        let whereClause = '';
        let whereValues: any[] = [];
        if (options.where) {
            const { clause, values } = QueryBuilder.buildWhereClause(options.where as Record<string, any>);
            whereClause = clause;
            whereValues = values;
        }

        // Build ORDER BY clause
        const orderByClause = options.orderBy ? `ORDER BY ${options.orderBy}` : '';

        // Build LIMIT/OFFSET clause
        let limitClause = '';
        if (options.limit) {
            limitClause = `LIMIT ${options.limit}`;
            if (options.offset) {
                limitClause += ` OFFSET ${options.offset}`;
            }
        }

        // Construct the full query
        const query = `
            SELECT ${mainTableColumns}, ${relationColumns}
            FROM ${this.tableName}
            ${joinClauses}
            ${whereClause}
            ${orderByClause}
            ${limitClause}
        `.trim();

        const rows = await this.db!.all(query, whereValues);
        return rows as R[];
    }

    // Transform flat rows with relations into nested structure
    transformRelationalData<R = any>(
        rows: any[],
        mainKey: string = 'id',
        relations: Array<{
            name: string;
            prefix: string;
            key: string;
            multiple?: boolean;
        }>
    ): R[] {
        const resultMap = new Map<string, any>();

        rows.forEach(row => {
            const mainId = row[mainKey];
            
            if (!resultMap.has(mainId)) {
                // Extract main entity data
                const mainEntity: any = {};
                Object.keys(row).forEach(key => {
                    // Check if this key belongs to a relation
                    const isRelationKey = relations.some(rel => key.startsWith(`${rel.prefix}_`));
                    if (!isRelationKey) {
                        mainEntity[key] = row[key];
                    }
                });

                // Initialize relation arrays/objects
                relations.forEach(rel => {
                    mainEntity[rel.name] = rel.multiple ? [] : null;
                });

                resultMap.set(mainId, mainEntity);
            }

            const mainEntity = resultMap.get(mainId);

            // Process relations
            relations.forEach(rel => {
                const relationData: any = {};
                let hasData = false;

                Object.keys(row).forEach(key => {
                    if (key.startsWith(`${rel.prefix}_`)) {
                        const actualKey = key.substring(rel.prefix.length + 1);
                        relationData[actualKey] = row[key];
                        if (row[key] !== null) hasData = true;
                    }
                });

                if (hasData) {
                    if (rel.multiple) {
                        // Check if this relation item already exists
                        const exists = mainEntity[rel.name].some((item: any) => 
                            item[rel.key] === relationData[rel.key]
                        );
                        if (!exists) {
                            mainEntity[rel.name].push(relationData);
                        }
                    } else {
                        mainEntity[rel.name] = relationData;
                    }
                }
            });
        });

        return Array.from(resultMap.values());
    }

    // Execute database schema (CREATE TABLE statements)
    async executeSchema(schema: string): Promise<void> {
        this.ensureDbConnection();
        await this.db!.exec(schema);
    }

    // Close database connection
    static async closeConnection(): Promise<void> {
        if (SQLiteRepository.dbInstance) {
            await SQLiteRepository.dbInstance.close();
            SQLiteRepository.dbInstance = null;
        }
    }
}
