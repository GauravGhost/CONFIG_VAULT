import { SERVER_CONFIG } from "../config/server-config.js";
import { SQLiteRepository } from "../repository/base-repository/sqlite-repository.js";
import UserRepository from "../repository/user-repository.js";
import { MigrationManager } from "./migration-manager.js";

export async function init() {
    try {
        const sql = new SQLiteRepository("test_table");
        await sql.initialize(SERVER_CONFIG.DB_PATH);

        // Initialize and run database migrations
        const migrationManager = new MigrationManager();
        await migrationManager.initialize(SERVER_CONFIG.DB_PATH);
        await migrationManager.runMigrations();
        await seedData();

        console.log(`Database initialized at ${SERVER_CONFIG.DB_PATH}`);
        console.log(`Database migrations completed successfully`);
        console.log(`Seed data inserted successfully`);
    } catch (error) {
        console.error(`Error initializing database:`, error);
        process.exit(1);
    }
}

export async function seedData() {
    const userRepo = new UserRepository();
    const isAdminExists = await userRepo.findOne({ role: 'admin' });
    if (!isAdminExists) {
        await userRepo.create({
            username: 'admin',
            password: "admin123",
            role: "admin",
            is_active: true,
        });
    }
}