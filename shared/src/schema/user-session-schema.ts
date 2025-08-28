import { z } from "zod";
import { createCrudSchemaTypes, createSchemaTypes } from "../utils/schema-types.js";
import { baseModelSchema } from "./base-schema.js";

export const userSessionSchema = baseModelSchema.extend({
    user_id: z.string().min(1, "User ID is required"),
    token_hash: z.string().min(1, "Token hash is required"),
    expires_at: z.string().min(1, "Expiration date is required"),
});

export const createUserSessionSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    token_hash: z.string().min(1, "Token hash is required"),
    expires_at: z.string().min(1, "Expiration date is required"),
});

export const updateUserSessionSchema = z.object({
    expires_at: z.string().min(1, "Expiration date is required").optional(),
});

const mainUserSessionSchemaTypes = createSchemaTypes(userSessionSchema);
const userSessionSchemaTypes = createCrudSchemaTypes(createUserSessionSchema, updateUserSessionSchema);

export type UserSession = z.infer<typeof userSessionSchema>;
export type UserSessionZod = typeof mainUserSessionSchemaTypes.Zod;
export type UserSessionCreate = z.infer<typeof createUserSessionSchema>;
export type UserSessionCreateZod = typeof userSessionSchemaTypes.Create.Zod;
export type UserSessionUpdate = z.infer<typeof updateUserSessionSchema>;
export type UserSessionUpdateZod = typeof userSessionSchemaTypes.Update.Zod;
