import { z } from "zod";
import { createCrudSchemaTypes, createSchemaTypes } from "../utils/schema-types";
import { baseModelSchema, permissionLevelEnum } from "./base-schema";

export const configurationShareSchema = baseModelSchema.extend({
    config_id: z.string().min(1, "Configuration ID is required"),
    shared_with_user_id: z.string().optional(),
    shared_with_email: z.string().optional(),
    permission_level: permissionLevelEnum.default('read'),
    shared_by: z.string().min(1, "Shared by user ID is required"),
    expires_at: z.string().optional(),
    is_active: z.boolean().default(true),
}).refine(
    data => data.shared_with_user_id || data.shared_with_email,
    {
        message: "Either shared_with_user_id or shared_with_email must be provided",
        path: ["shared_with_user_id"]
    }
);

export const createConfigurationShareSchema = z.object({
    config_id: z.string().min(1, "Configuration ID is required"),
    shared_with_user_id: z.string().optional(),
    shared_with_email: z.string().optional(),
    permission_level: permissionLevelEnum.optional(),
    shared_by: z.string().min(1, "Shared by user ID is required"),
    expires_at: z.string().optional(),
}).refine(
    data => data.shared_with_user_id || data.shared_with_email,
    {
        message: "Either shared_with_user_id or shared_with_email must be provided",
        path: ["shared_with_user_id"]
    }
);

export const updateConfigurationShareSchema = z.object({
    permission_level: permissionLevelEnum.optional(),
    expires_at: z.string().optional(),
    is_active: z.boolean().optional(),
});

const mainConfigurationShareSchemaTypes = createSchemaTypes(configurationShareSchema);
const configurationShareSchemaTypes = createCrudSchemaTypes(createConfigurationShareSchema, updateConfigurationShareSchema);

export type ConfigurationShare = z.infer<typeof configurationShareSchema>;
export type ConfigurationShareCreate = z.infer<typeof createConfigurationShareSchema>;
export type ConfigurationShareUpdate = z.infer<typeof updateConfigurationShareSchema>;
