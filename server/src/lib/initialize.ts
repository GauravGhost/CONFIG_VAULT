import { SERVER_CONFIG } from "../config/server-config.js";
import { SQLiteRepository } from "../repository/base-repository/sqlite-repository.js";
import { MigrationManager } from "./migration-manager.js";

export async function init(){
    try {
        const sql = new SQLiteRepository("test_table");
        await sql.initialize(SERVER_CONFIG.DB_PATH);
        
        // Initialize and run database migrations
        const migrationManager = new MigrationManager();
        await migrationManager.initialize(SERVER_CONFIG.DB_PATH);
        await migrationManager.runMigrations();
        
        console.log(`Database initialized at ${SERVER_CONFIG.DB_PATH}`);
        console.log(`Database migrations completed successfully`);
    } catch (error) {
        console.error(`Error initializing database:`, error);
        process.exit(1);
    }
}