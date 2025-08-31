import { changePasswordSchema, createUserSchema, updateUserSchema } from "./user-schema";
import { createProjectSchema, createProjectSchemaFrontend, updateProjectSchema } from "./project-schema";
import { createConfigurationSchema, createConfigurationSchemaWithDetails, updateConfigurationSchema } from "./configuration-schema";
import { createConfigurationDetailSchema, updateConfigurationDetailSchema } from "./configuration-detail-schema";
import { createServiceSchema, updateServiceSchema } from "./service-schema";
import { createUserSessionSchema, updateUserSessionSchema } from "./user-session-schema";
import { createConfigurationShareSchema, updateConfigurationShareSchema } from "./configuration-share-schema";
import { createConfigurationAccessLogSchema, updateConfigurationAccessLogSchema } from "./configuration-access-log-schema";

// Re-export all schemas and types
export * from "./base-schema";
export * from "./user-schema";
export * from "./project-schema";
export * from "./configuration-schema";
export * from "./configuration-detail-schema";
export * from "./service-schema";
export * from "./user-session-schema";
export * from "./configuration-share-schema";
export * from "./configuration-access-log-schema";

export const schema = {
    // Create and Update operation schemas
    create: {
        user: createUserSchema,
        project: createProjectSchema,
        projectFrontend: createProjectSchemaFrontend,
        configuration: createConfigurationSchema,
        configurationWithDetail: createConfigurationSchemaWithDetails,
        configurationDetail: createConfigurationDetailSchema,
        service: createServiceSchema,
        userSession: createUserSessionSchema,
        configurationShare: createConfigurationShareSchema,
        configurationAccessLog: createConfigurationAccessLogSchema,
    },
    update: {
        user: updateUserSchema,
        password: changePasswordSchema,
        project: updateProjectSchema,
        configuration: updateConfigurationSchema,
        configurationDetail: updateConfigurationDetailSchema,
        service: updateServiceSchema,
        userSession: updateUserSessionSchema,
        configurationShare: updateConfigurationShareSchema,
        configurationAccessLog: updateConfigurationAccessLogSchema,
    }
};
