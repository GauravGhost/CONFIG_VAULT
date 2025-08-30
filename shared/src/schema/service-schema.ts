import { z } from "zod";
import { createCrudSchemaTypes, createSchemaTypes } from "../utils/schema-types";
import { baseModelSchema, environmentEnum, serviceStatusEnum } from "./base-schema";

export const serviceSchema = baseModelSchema.extend({
    project_id: z.string().min(1, "Project ID is required"),
    name: z.string().min(1, "Service name is required"),
    description: z.string().optional(),
    internal_ip: z.string().optional(),
    external_ip: z.string().optional(),
    domain: z.string().optional(),
    ports: z.string().optional(),
    status: serviceStatusEnum.default('unknown'),
    health_check_url: z.string().optional(),
    last_health_check: z.string().optional(),
    environment: environmentEnum.default('development'),
});

export const createServiceSchema = z.object({
    project_id: z.string().min(1, "Project ID is required"),
    name: z.string().min(2, "Service name must be at least 2 characters"),
    description: z.string().optional(),
    internal_ip: z.string().optional(),
    external_ip: z.string().optional(),
    domain: z.string().optional(),
    ports: z.string().optional(),
    health_check_url: z.string().optional(),
    environment: environmentEnum.optional(),
});

export const updateServiceSchema = z.object({
    name: z.string().min(2, "Service name must be at least 2 characters").optional(),
    description: z.string().optional(),
    internal_ip: z.string().optional(),
    external_ip: z.string().optional(),
    domain: z.string().optional(),
    ports: z.string().optional(),
    status: serviceStatusEnum.optional(),
    health_check_url: z.string().optional(),
    last_health_check: z.string().optional(),
    environment: environmentEnum.optional(),
});

const mainServiceSchemaTypes = createSchemaTypes(serviceSchema);
const serviceSchemaTypes = createCrudSchemaTypes(createServiceSchema, updateServiceSchema);

export type Service = z.infer<typeof serviceSchema>;
export type ServiceCreate = z.infer<typeof createServiceSchema>;
export type ServiceUpdate = z.infer<typeof updateServiceSchema>;
