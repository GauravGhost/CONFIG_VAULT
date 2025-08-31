import { z } from "zod";
import { baseModelSchema, sharingTypeEnum } from "./base-schema";

export const configurationSchema = baseModelSchema.extend({
    project_id: z.string().min(1, "Project ID is required"),
    name: z.string().min(1, "Configuration name is required"),
    file_type: z.string().min(1, "File type is required"),
    content: z.string().optional(),
    sharing_type: sharingTypeEnum.default('private'),
    share_token: z.string().optional(),
    is_active: z.boolean().default(true),
});

export const createConfigurationSchema = z.object({
    project_id: z.string().min(1, "Project ID is required"),
    name: z.string().min(2, "Configuration name must be at least 2 characters"),
    file_type: z.string().min(1, "File type is required"),
    content: z.string().optional(),
    sharing_type: sharingTypeEnum.optional(),
});

export const updateConfigurationSchema = z.object({
    name: z.string().min(2, "Configuration name must be at least 2 characters").optional(),
    file_type: z.string().min(1, "File type is required").optional(),
    content: z.string().optional(),
    sharing_type: sharingTypeEnum.optional(),
    is_active: z.boolean().optional(),
});

export type Configuration = z.infer<typeof configurationSchema>;
export type ConfigurationCreate = z.infer<typeof createConfigurationSchema>;
export type ConfigurationUpdate = z.infer<typeof updateConfigurationSchema>;
