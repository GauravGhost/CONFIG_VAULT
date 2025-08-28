#!/usr/bin/env node

import { MigrationManager } from '../lib/migration-manager.js';
import { SERVER_CONFIG } from '../config/server-config.js';

async function runMigrationCommand() {
    const command = process.argv[2];
    
    const migrationManager = new MigrationManager();
    await migrationManager.initialize(SERVER_CONFIG.DB_PATH);

    switch (command) {
        case 'status':
            await showMigrationStatus(migrationManager);
            break;
        case 'up':
            await migrationManager.runMigrations();
            break;
        case 'list':
            await listAppliedMigrations(migrationManager);
            break;
        default:
            console.log(`
Usage: npm run migrate <command>

Commands:
  status    Show migration status
  up        Run all pending migrations
  list      List all applied migrations

Examples:
  npm run migrate status
  npm run migrate up
  npm run migrate list
            `);
    }
}

async function showMigrationStatus(migrationManager: MigrationManager) {
    const currentVersion = await migrationManager.getCurrentVersion();
    const appliedMigrations = await migrationManager.getAppliedMigrations();
    
    console.log(`Current database version: ${currentVersion}`);
    console.log(`Total applied migrations: ${appliedMigrations.length}`);
    
    if (appliedMigrations.length > 0) {
        console.log('\nApplied migrations:');
        appliedMigrations.forEach(m => {
            console.log(`  Version ${m.version} - Applied at ${m.applied_at}`);
        });
    }
}

async function listAppliedMigrations(migrationManager: MigrationManager) {
    const appliedMigrations = await migrationManager.getAppliedMigrations();
    
    if (appliedMigrations.length === 0) {
        console.log('No migrations have been applied yet.');
        return;
    }
    
    console.log('Applied migrations:');
    appliedMigrations.forEach(m => {
        console.log(`  Version ${m.version} - Applied at ${m.applied_at}`);
    });
}

runMigrationCommand().catch(console.error);
