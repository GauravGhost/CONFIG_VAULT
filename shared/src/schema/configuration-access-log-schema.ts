import { z } from "zod";
import { createCrudSchemaTypes, createSchemaTypes } from "../utils/schema-types";
import { baseModelSchema, accessTypeEnum } from "./base-schema";

export const configurationAccessLogSchema = baseModelSchema.extend({
    config_id: z.string().min(1, "Configuration ID is required"),
    accessed_by: z.string().optional(),
    access_type: accessTypeEnum,
    ip_address: z.string().optional(),
    user_agent: z.string().optional(),
    accessed_at: z.string().optional(),
});

export const createConfigurationAccessLogSchema = z.object({
    config_id: z.string().min(1, "Configuration ID is required"),
    accessed_by: z.string().optional(),
    access_type: accessTypeEnum,
    ip_address: z.string().optional(),
    user_agent: z.string().optional(),
});

export const updateConfigurationAccessLogSchema = z.object({
    access_type: accessTypeEnum.optional(),
});

const mainConfigurationAccessLogSchemaTypes = createSchemaTypes(configurationAccessLogSchema);
const configurationAccessLogSchemaTypes = createCrudSchemaTypes(createConfigurationAccessLogSchema, updateConfigurationAccessLogSchema);

export type ConfigurationAccessLog = z.infer<typeof configurationAccessLogSchema>;
export type ConfigurationAccessLogCreate = z.infer<typeof createConfigurationAccessLogSchema>;
export type ConfigurationAccessLogUpdate = z.infer<typeof updateConfigurationAccessLogSchema>;
