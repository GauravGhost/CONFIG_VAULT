import { z } from "zod";

// Base schema
export const baseModelSchema = z.object({
    id: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Enums
export const userRoleEnum = z.enum(['user', 'admin', 'moderator']);
export const sharingTypeEnum = z.enum(['private', 'public', 'shared']);
export const environmentEnum = z.enum(['development', 'staging', 'production']);
export const permissionLevelEnum = z.enum(['read', 'write', 'admin']);
export const serviceStatusEnum = z.enum(['unknown', 'running', 'stopped', 'error', 'maintenance']);
export const accessTypeEnum = z.enum(['view', 'download', 'edit', 'delete', 'share']);
export const fileTypeEnum = z.enum(['json', 'yaml', 'env', 'properties', 'xml', 'toml', 'ini', 'config']);
export const activeStatusEnum = z.enum(['true', 'false']);

// Enum types
export type UserRole = z.infer<typeof userRoleEnum>;
export type SharingType = z.infer<typeof sharingTypeEnum>;
export type Environment = z.infer<typeof environmentEnum>;
export type PermissionLevel = z.infer<typeof permissionLevelEnum>;
export type ServiceStatus = z.infer<typeof serviceStatusEnum>;
export type AccessType = z.infer<typeof accessTypeEnum>;
export type FileType = z.infer<typeof fileTypeEnum>;
export type BaseModel = z.infer<typeof baseModelSchema>;
