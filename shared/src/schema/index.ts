import { changePasswordSchema, createUserSchema, updateUserSchema } from "./user-schema";
import { createProjectSchema, updateProjectSchema } from "./project-schema";
import { createConfigurationSchema, updateConfigurationSchema } from "./configuration-schema";
import { createConfigurationHistorySchema, updateConfigurationHistorySchema } from "./configuration-history-schema";
import { createServiceSchema, updateServiceSchema } from "./service-schema";
import { createTemplateSchema, updateTemplateSchema } from "./template-schema";
import { createUserSessionSchema, updateUserSessionSchema } from "./user-session-schema";
import { createConfigurationShareSchema, updateConfigurationShareSchema } from "./configuration-share-schema";
import { createConfigurationAccessLogSchema, updateConfigurationAccessLogSchema } from "./configuration-access-log-schema";

// Re-export all schemas and types
export * from "./base-schema";
export * from "./user-schema";
export * from "./project-schema";
export * from "./configuration-schema";
export * from "./configuration-history-schema";
export * from "./service-schema";
export * from "./template-schema";
export * from "./user-session-schema";
export * from "./configuration-share-schema";
export * from "./configuration-access-log-schema";

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
        password: changePasswordSchema,
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
