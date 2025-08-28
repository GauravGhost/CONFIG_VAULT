import { z } from "zod";
import { createCrudSchemaTypes, createSchemaTypes } from "../utils/schema-types";
import { baseModelSchema, userRoleEnum } from "./base-schema";

export const userSchema = baseModelSchema.extend({
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: userRoleEnum.default('user'),
    is_active: z.boolean().default(true),
    avatar_url: z.string().optional(),
    name: z.string().optional(),
});

export const createUserSchema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: userRoleEnum.optional(),
    name: z.string().optional(),
    avatar_url: z.string().optional(),
});

export const updateUserSchema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters").optional(),
    email: z.string().min(1, "Email is required").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    role: userRoleEnum.optional(),
    name: z.string().optional(),
    avatar_url: z.string().optional(),
    is_active: z.boolean().optional(),
});

const mainUserSchemaTypes = createSchemaTypes(userSchema);
const userSchemaTypes = createCrudSchemaTypes(createUserSchema, updateUserSchema);

export type User = z.infer<typeof userSchema>;
export type UserZod = typeof mainUserSchemaTypes.Zod;
export type UserCreate = z.infer<typeof createUserSchema>;
export type UserCreateZod = typeof userSchemaTypes.Create.Zod;
export type UserUpdate = z.infer<typeof updateUserSchema>;
export type UserUpdateZod = typeof userSchemaTypes.Update.Zod;