import { z } from "zod";
import { baseModelSchema, environmentEnum } from "./base-schema";

export const configurationDetailSchema = baseModelSchema.extend({
    configuration_id: z.string().min(1, "Configuration ID is required"),
    environment: environmentEnum,
    env: z.string().min(1, "Environment name is required"),
    code: z.string().min(1, "Code is required"),
});

export const createConfigurationDetailSchema = z.object({
    configuration_id: z.string().min(1, "Configuration ID is required"),
    environment: environmentEnum,
    code: z.string().min(1, "Code is required"),
    env: z.string().min(1, "Environment name is required").optional(),
});

export const createConfigurationDetailSchemaFrontend = z.object({
    environment: environmentEnum,
    code: z.string().min(1, "Code is required"),
    env: z.string().min(1, "Environment name is required").optional(),
});

export const updateConfigurationDetailSchema = z.object({
    environment: environmentEnum.optional(),
    env: z.string().min(1, "Environment name is required").optional(),
    code: z.string().min(1, "Code is required").optional(),
});

export type ConfigurationDetailFrontend = z.infer<typeof createConfigurationDetailSchemaFrontend>;
export type ConfigurationDetail = z.infer<typeof configurationDetailSchema>;
export type ConfigurationDetailCreate = z.infer<typeof createConfigurationDetailSchema>;
export type ConfigurationDetailUpdate = z.infer<typeof updateConfigurationDetailSchema>;
