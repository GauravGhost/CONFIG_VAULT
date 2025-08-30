import { z } from "zod";
import { createCrudSchemaTypes, createSchemaTypes } from "../utils/schema-types";
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
    env: z.string().min(1, "Environment name is required"),
    code: z.string().min(1, "Code is required"),
});

export const updateConfigurationDetailSchema = z.object({
    environment: environmentEnum.optional(),
    env: z.string().min(1, "Environment name is required").optional(),
    code: z.string().min(1, "Code is required").optional(),
});

const mainConfigurationDetailSchemaTypes = createSchemaTypes(configurationDetailSchema);
const configurationDetailSchemaTypes = createCrudSchemaTypes(createConfigurationDetailSchema, updateConfigurationDetailSchema);

export type ConfigurationDetail = z.infer<typeof configurationDetailSchema>;
export type ConfigurationDetailZod = typeof mainConfigurationDetailSchemaTypes.Zod;
export type ConfigurationDetailCreate = z.infer<typeof createConfigurationDetailSchema>;
export type ConfigurationDetailCreateZod = typeof configurationDetailSchemaTypes.Create.Zod;
export type ConfigurationDetailUpdate = z.infer<typeof updateConfigurationDetailSchema>;
export type ConfigurationDetailUpdateZod = typeof configurationDetailSchemaTypes.Update.Zod;
