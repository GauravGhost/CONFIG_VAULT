import { z } from "zod";
import { createCrudSchemaTypes, createSchemaTypes } from "../utils/schema-types";
import { baseModelSchema } from "./base-schema";

export const projectSchema = baseModelSchema.extend({
    user_id: z.string().min(1, "User ID is required"),
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    is_active: z.boolean().default(true),
});

export const createProjectSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    name: z.string().min(2, "Project name must be at least 2 characters"),
    description: z.string().optional(),
});

export const updateProjectSchema = z.object({
    name: z.string().min(2, "Project name must be at least 2 characters").optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
});

const mainProjectSchemaTypes = createSchemaTypes(projectSchema);
const projectSchemaTypes = createCrudSchemaTypes(createProjectSchema, updateProjectSchema);

export type Project = z.infer<typeof projectSchema>;
export type ProjectZod = typeof mainProjectSchemaTypes.Zod;
export type ProjectCreate = z.infer<typeof createProjectSchema>;
export type ProjectCreateZod = typeof projectSchemaTypes.Create.Zod;
export type ProjectUpdate = z.infer<typeof updateProjectSchema>;
export type ProjectUpdateZod = typeof projectSchemaTypes.Update.Zod;
