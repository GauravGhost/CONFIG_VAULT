import { SERVER_CONFIG } from "../config/server-config.js";
import { SQLiteRepository } from "../repository/base-repository/sqlite-repository.js";
import { sqliteSchema } from "./models.js";

export async function init(){
    try {
        const sql = new SQLiteRepository("test_table");
        await sql.initialize(SERVER_CONFIG.DB_PATH);
        
        // Initialize database schema (create all tables and indexes)
        await sql.executeSchema(sqliteSchema);
        
        console.log(`Database initialized at ${SERVER_CONFIG.DB_PATH}`);
        console.log(`Database schema created successfully`);
    } catch (error) {
        console.error(`Error initializing database:`, error);
        process.exit(1);
    }
}