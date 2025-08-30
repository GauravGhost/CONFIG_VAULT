import { z } from "zod";
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
    is_active: z.boolean().default(true),
});

export const createProjectSchemaFrontend = z.object({
    name: z.string().min(2, "Project name must be at least 2 characters"),
    description: z.string().optional(),
});

export const updateProjectSchema = z.object({
    name: z.string().min(2, "Project name must be at least 2 characters").optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectCreate = z.infer<typeof createProjectSchema>;
export type ProjectCreateFrontend = z.infer<typeof createProjectSchemaFrontend>;
export type ProjectUpdate = z.infer<typeof updateProjectSchema>;
