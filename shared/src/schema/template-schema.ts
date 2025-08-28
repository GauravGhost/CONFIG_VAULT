import { z } from "zod";
import { createCrudSchemaTypes, createSchemaTypes } from "../utils/schema-types.js";
import { baseModelSchema, fileTypeEnum } from "./base-schema.js";

export const templateSchema = baseModelSchema.extend({
    name: z.string().min(1, "Template name is required"),
    description: z.string().optional(),
    file_type: fileTypeEnum,
    content: z.string().min(1, "Template content is required"),
    is_public: z.boolean().default(false),
    created_by: z.string().optional(),
    usage_count: z.number().int().nonnegative().default(0),
});

export const createTemplateSchema = z.object({
    name: z.string().min(2, "Template name must be at least 2 characters"),
    description: z.string().optional(),
    file_type: fileTypeEnum,
    content: z.string().min(1, "Template content is required"),
    is_public: z.boolean().optional(),
    created_by: z.string().optional(),
});

export const updateTemplateSchema = z.object({
    name: z.string().min(2, "Template name must be at least 2 characters").optional(),
    description: z.string().optional(),
    file_type: fileTypeEnum.optional(),
    content: z.string().min(1, "Template content is required").optional(),
    is_public: z.boolean().optional(),
});

const mainTemplateSchemaTypes = createSchemaTypes(templateSchema);
const templateSchemaTypes = createCrudSchemaTypes(createTemplateSchema, updateTemplateSchema);

export type Template = z.infer<typeof templateSchema>;
export type TemplateZod = typeof mainTemplateSchemaTypes.Zod;
export type TemplateCreate = z.infer<typeof createTemplateSchema>;
export type TemplateCreateZod = typeof templateSchemaTypes.Create.Zod;
export type TemplateUpdate = z.infer<typeof updateTemplateSchema>;
export type TemplateUpdateZod = typeof templateSchemaTypes.Update.Zod;
