export interface Migration {
    version: number;
    description: string;
    up: string;
    down?: string;
}

export const migrations: Migration[] = [
    {
        version: 1,
        description: 'Complete initial schema creation',
        up: `
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NULL,
    password TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Configuration files table
CREATE TABLE IF NOT EXISTS configurations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    content TEXT,
    sharing_type TEXT DEFAULT 'private',
    share_token TEXT UNIQUE,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Configuration detail table for environment-specific configurations
CREATE TABLE IF NOT EXISTS configuration_detail (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    configuration_id TEXT NOT NULL REFERENCES configurations(id) ON DELETE CASCADE,
    environment TEXT NOT NULL,
    env TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Services/endpoints table
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    internal_ip TEXT,
    external_ip TEXT,
    domain TEXT,
    ports TEXT,
    status TEXT DEFAULT 'unknown',
    health_check_url TEXT,
    last_health_check DATETIME,
    environment TEXT DEFAULT 'development',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Configuration sharing table
CREATE TABLE IF NOT EXISTS configuration_shares (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    config_id TEXT NOT NULL REFERENCES configurations(id) ON DELETE CASCADE,
    shared_with_user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    shared_with_email TEXT,
    permission_level TEXT DEFAULT 'read',
    shared_by TEXT NOT NULL REFERENCES users(id),
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_share_target CHECK (
        (shared_with_user_id IS NOT NULL AND shared_with_email IS NULL) OR
        (shared_with_user_id IS NULL AND shared_with_email IS NOT NULL)
    )
);

-- Configuration access logs
CREATE TABLE IF NOT EXISTS configuration_access_logs (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    config_id TEXT NOT NULL REFERENCES configurations(id) ON DELETE CASCADE,
    accessed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    access_type TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Schema migrations table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_configurations_project_id ON configurations(project_id);
CREATE INDEX IF NOT EXISTS idx_configurations_sharing_type ON configurations(sharing_type);
CREATE INDEX IF NOT EXISTS idx_configurations_share_token ON configurations(share_token);
CREATE INDEX IF NOT EXISTS idx_configuration_detail_config_id ON configuration_detail(configuration_id);
CREATE INDEX IF NOT EXISTS idx_configuration_detail_environment ON configuration_detail(environment);
CREATE INDEX IF NOT EXISTS idx_services_project_id ON services(project_id);
CREATE INDEX IF NOT EXISTS idx_config_shares_config_id ON configuration_shares(config_id);
CREATE INDEX IF NOT EXISTS idx_config_shares_shared_with ON configuration_shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_config_shares_email ON configuration_shares(shared_with_email);
CREATE INDEX IF NOT EXISTS idx_config_access_logs_config_id ON configuration_access_logs(config_id);
CREATE INDEX IF NOT EXISTS idx_config_access_logs_accessed_by ON configuration_access_logs(accessed_by);
        `,
        down: `
-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS configuration_access_logs;
DROP TABLE IF EXISTS configuration_shares;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS configuration_detail;
DROP TABLE IF EXISTS configurations;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS schema_migrations;
        `
    }
];