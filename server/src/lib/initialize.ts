import { SERVER_CONFIG } from "../config/server-config.js";
import { SQLiteRepository } from "../repository/base-repository/sqlite-repository.js";

export async function init(){
    try {
        const sql = new SQLiteRepository("test_table");
        await sql.initialize(SERVER_CONFIG.DB_PATH);
        console.log(`Database initialized at ${SERVER_CONFIG.DB_PATH}`);
    } catch (error) {
        console.error(`Error initializing database:`, error);
        process.exit(1);
    }
}