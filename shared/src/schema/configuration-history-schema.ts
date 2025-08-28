import { z } from "zod";
import { createCrudSchemaTypes, createSchemaTypes } from "../utils/schema-types.js";
import { baseModelSchema } from "./base-schema.js";

export const configurationHistorySchema = baseModelSchema.extend({
    config_id: z.string().min(1, "Configuration ID is required"),
    content: z.string().min(1, "Content is required"),
    version: z.number().int().positive(),
    change_description: z.string().optional(),
    created_by: z.string().min(1, "Creator ID is required"),
});

export const createConfigurationHistorySchema = z.object({
    config_id: z.string().min(1, "Configuration ID is required"),
    content: z.string().min(1, "Content is required"),
    version: z.number().int().positive(),
    change_description: z.string().optional(),
    created_by: z.string().min(1, "Creator ID is required"),
});

export const updateConfigurationHistorySchema = z.object({
    change_description: z.string().optional(),
});

const mainConfigurationHistorySchemaTypes = createSchemaTypes(configurationHistorySchema);
const configurationHistorySchemaTypes = createCrudSchemaTypes(createConfigurationHistorySchema, updateConfigurationHistorySchema);

export type ConfigurationHistory = z.infer<typeof configurationHistorySchema>;
export type ConfigurationHistoryZod = typeof mainConfigurationHistorySchemaTypes.Zod;
export type ConfigurationHistoryCreate = z.infer<typeof createConfigurationHistorySchema>;
export type ConfigurationHistoryCreateZod = typeof configurationHistorySchemaTypes.Create.Zod;
export type ConfigurationHistoryUpdate = z.infer<typeof updateConfigurationHistorySchema>;
export type ConfigurationHistoryUpdateZod = typeof configurationHistorySchemaTypes.Update.Zod;
