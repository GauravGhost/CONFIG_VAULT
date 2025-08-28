import { z } from "zod";
import { createCrudSchemaTypes, createSchemaTypes } from "../utils/schema-types";
import { baseModelSchema, fileTypeEnum, environmentEnum, sharingTypeEnum } from "./base-schema";

export const configurationSchema = baseModelSchema.extend({
    project_id: z.string().min(1, "Project ID is required"),
    name: z.string().min(1, "Configuration name is required"),
    file_type: fileTypeEnum,
    file_path: z.string().min(1, "File path is required"),
    content: z.string().optional(),
    version: z.number().int().positive().default(1),
    environment: environmentEnum.default('development'),
    sharing_type: sharingTypeEnum.default('private'),
    share_token: z.string().optional(),
    is_active: z.boolean().default(true),
});

export const createConfigurationSchema = z.object({
    project_id: z.string().min(1, "Project ID is required"),
    name: z.string().min(2, "Configuration name must be at least 2 characters"),
    file_type: fileTypeEnum,
    file_path: z.string().min(1, "File path is required"),
    content: z.string().optional(),
    environment: environmentEnum.optional(),
    sharing_type: sharingTypeEnum.optional(),
});

export const updateConfigurationSchema = z.object({
    name: z.string().min(2, "Configuration name must be at least 2 characters").optional(),
    file_type: fileTypeEnum.optional(),
    file_path: z.string().min(1, "File path is required").optional(),
    content: z.string().optional(),
    environment: environmentEnum.optional(),
    sharing_type: sharingTypeEnum.optional(),
    is_active: z.boolean().optional(),
});

const mainConfigurationSchemaTypes = createSchemaTypes(configurationSchema);
const configurationSchemaTypes = createCrudSchemaTypes(createConfigurationSchema, updateConfigurationSchema);

export type Configuration = z.infer<typeof configurationSchema>;
export type ConfigurationZod = typeof mainConfigurationSchemaTypes.Zod;
export type ConfigurationCreate = z.infer<typeof createConfigurationSchema>;
export type ConfigurationCreateZod = typeof configurationSchemaTypes.Create.Zod;
export type ConfigurationUpdate = z.infer<typeof updateConfigurationSchema>;
export type ConfigurationUpdateZod = typeof configurationSchemaTypes.Update.Zod;
