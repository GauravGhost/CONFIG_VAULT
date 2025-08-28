import { createUserSchema, updateUserSchema } from "./user-schema.js";
import { createProjectSchema, updateProjectSchema } from "./project-schema.js";
import { createConfigurationSchema, updateConfigurationSchema } from "./configuration-schema.js";
import { createConfigurationHistorySchema, updateConfigurationHistorySchema } from "./configuration-history-schema.js";
import { createServiceSchema, updateServiceSchema } from "./service-schema.js";
import { createTemplateSchema, updateTemplateSchema } from "./template-schema.js";
import { createUserSessionSchema, updateUserSessionSchema } from "./user-session-schema.js";
import { createConfigurationShareSchema, updateConfigurationShareSchema } from "./configuration-share-schema.js";
import { createConfigurationAccessLogSchema, updateConfigurationAccessLogSchema } from "./configuration-access-log-schema.js";

// Re-export all schemas and types
export * from "./base-schema.js";
export * from "./user-schema.js";
export * from "./project-schema.js";
export * from "./configuration-schema.js";
export * from "./configuration-history-schema.js";
export * from "./service-schema.js";
export * from "./template-schema.js";
export * from "./user-session-schema.js";
export * from "./configuration-share-schema.js";
export * from "./configuration-access-log-schema.js";

export const schema = {
    // Create and Update operation schemas
    create: {
        user: createUserSchema,
        project: createProjectSchema,
        configuration: createConfigurationSchema,
        configurationHistory: createConfigurationHistorySchema,
        service: createServiceSchema,
        template: createTemplateSchema,
        userSession: createUserSessionSchema,
        configurationShare: createConfigurationShareSchema,
        configurationAccessLog: createConfigurationAccessLogSchema,
    },
    update: {
        user: updateUserSchema,
        project: updateProjectSchema,
        configuration: updateConfigurationSchema,
        configurationHistory: updateConfigurationHistorySchema,
        service: updateServiceSchema,
        template: updateTemplateSchema,
        userSession: updateUserSessionSchema,
        configurationShare: updateConfigurationShareSchema,
        configurationAccessLog: updateConfigurationAccessLogSchema,
    }
};