export interface BaseModel {
    id?: string;
    created_at?: string;
    updated_at?: string;
}

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

export interface User extends BaseModel {
    username: string;
    email: string;
    password: string;
    role?: string;
    is_active?: boolean;
}

export interface Project extends BaseModel {
    user_id: string;
    name: string;
    description?: string;
    is_active?: boolean;
}

export interface Configuration extends BaseModel {
    project_id: string;
    name: string;
    file_type: string;
    file_path: string;
    content?: string;
    version?: number;
    environment?: string;
    sharing_type?: string;
    share_token?: string;
    is_active?: boolean;
}

export interface ConfigurationHistory extends BaseModel {
    config_id: string;
    content: string;
    version: number;
    change_description?: string;
    created_by: string;
}

export interface Service extends BaseModel {
    project_id: string;
    name: string;
    description?: string;
    internal_ip?: string;
    external_ip?: string;
    domain?: string;
    ports?: string;
    status?: string;
    health_check_url?: string;
    last_health_check?: string;
    environment?: string;
}

export interface Template extends BaseModel {
    name: string;
    description?: string;
    file_type: string;
    content: string;
    is_public?: boolean;
    created_by?: string;
    usage_count?: number;
}

export interface UserSession extends BaseModel {
    user_id: string;
    token_hash: string;
    expires_at: string;
}

export interface ConfigurationShare extends BaseModel {
    config_id: string;
    shared_with_user_id?: string;
    shared_with_email?: string;
    permission_level?: string;
    shared_by: string;
    expires_at?: string;
    is_active?: boolean;
}

export interface ConfigurationAccessLog extends BaseModel {
    config_id: string;
    accessed_by?: string;
    access_type: string;
    ip_address?: string;
    user_agent?: string;
    accessed_at?: string;
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator'
}

export enum SharingType {
    PRIVATE = 'private',
    PUBLIC = 'public',
    SHARED = 'shared'
}

export enum Environment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production'
}

export enum PermissionLevel {
    READ = 'read',
    WRITE = 'write',
    ADMIN = 'admin'
}

export enum ServiceStatus {
    UNKNOWN = 'unknown',
    RUNNING = 'running',
    STOPPED = 'stopped',
    ERROR = 'error',
    MAINTENANCE = 'maintenance'
}

export enum AccessType {
    VIEW = 'view',
    DOWNLOAD = 'download',
    EDIT = 'edit',
    DELETE = 'delete',
    SHARE = 'share'
}

export enum FileType {
    JSON = 'json',
    YAML = 'yaml',
    ENV = 'env',
    PROPERTIES = 'properties',
    XML = 'xml',
    TOML = 'toml',
    INI = 'ini',
    CONFIG = 'config'
}