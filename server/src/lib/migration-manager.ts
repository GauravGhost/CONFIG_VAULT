import { SQLiteRepository } from "../repository/base-repository/sqlite-repository.js";
import { migrations } from "./migrations.js";
import type { Migration } from "./migrations.js";

export class MigrationManager {
    private readonly repository: SQLiteRepository<any>;

    constructor() {
        this.repository = new SQLiteRepository('schema_migrations');
    }

    async initialize(dbPath: string): Promise<void> {
        await this.repository.initialize(dbPath);
    }

    /**
     * Get the current database schema version
     */
    async getCurrentVersion(): Promise<number> {
        try {
            const result = await this.repository.rawQuery(
                'SELECT MAX(version) as version FROM schema_migrations'
            );
            return result[0]?.version || 0;
        } catch (error) {
            // If the table doesn't exist yet, return 0
            console.log('Schema migrations table not found, assuming version 0');
            return 0;
        }
    }

    /**
     * Check if a specific migration version has been applied
     */
    async isMigrationApplied(version: number): Promise<boolean> {
        try {
            const result = await this.repository.rawQuery(
                'SELECT COUNT(*) as count FROM schema_migrations WHERE version = ?',
                [version]
            );
            return result[0]?.count > 0;
        } catch (error) {
            console.log(`Error checking migration ${version}:`, error);
            return false;
        }
    }

    /**
     * Apply a specific migration
     */
    async applyMigration(migration: Migration): Promise<void> {
        console.log(`Applying migration ${migration.version}: ${migration.description}`);
        
        await this.repository.executeSchema(migration.up);
        
        await this.repository.rawQuery(
            'INSERT INTO schema_migrations (version) VALUES (?)',
            [migration.version]
        );
        
        console.log(`Migration ${migration.version} applied successfully`);
    }

    /**
     * Apply all pending migrations
     */
    async runMigrations(): Promise<void> {
        console.log('Starting database migrations...');
        
        const currentVersion = await this.getCurrentVersion();
        console.log(`Current database version: ${currentVersion}`);

        const pendingMigrations = migrations.filter(m => m.version > currentVersion);
        
        if (pendingMigrations.length === 0) {
            console.log('No pending migrations');
            return;
        }

        console.log(`Found ${pendingMigrations.length} pending migrations`);

        pendingMigrations.sort((a, b) => a.version - b.version);

        for (const migration of pendingMigrations) {
            await this.applyMigration(migration);
        }

        console.log('All migrations completed successfully');
    }

    /**
     * Get list of all applied migrations
     */
    async getAppliedMigrations(): Promise<{ version: number; applied_at: string }[]> {
        try {
            return await this.repository.rawQuery(
                'SELECT version, applied_at FROM schema_migrations ORDER BY version'
            );
        } catch (error) {
            console.log('Error retrieving applied migrations:', error);
            return [];
        }
    }
}
