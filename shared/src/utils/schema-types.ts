import { z } from "zod";

/**
 * Utility type to generate all necessary schema types from a Zod schema
 * @template TSchema - The Zod schema type
 */
export type SchemaTypes<TSchema extends z.ZodType> = {
  Zod: TSchema;
  Type: z.infer<TSchema>;
};

/**
 * Creates a schema types object with both the Zod schema and inferred type
 * @param schema - The Zod schema
 * @returns An object containing the schema and its inferred type
 */
export function createSchemaTypes<TSchema extends z.ZodType>(schema: TSchema) {
  return {
    Zod: schema,
    Type: {} as z.infer<TSchema>,
  };
}

/**
 * Helper type for CRUD operations - generates Create and Update schema types
 * @template TCreateSchema - The create schema type
 * @template TUpdateSchema - The update schema type
 */
export type CrudSchemaTypes<
  TCreateSchema extends z.ZodType,
  TUpdateSchema extends z.ZodType
> = {
  Create: SchemaTypes<TCreateSchema>;
  Update: SchemaTypes<TUpdateSchema>;
};

/**
 * Creates CRUD schema types for create and update operations
 * @param createSchema - The create schema
 * @param updateSchema - The update schema
 * @returns An object with Create and Update schema types
 */
export function createCrudSchemaTypes<
  TCreateSchema extends z.ZodType,
  TUpdateSchema extends z.ZodType
>(createSchema: TCreateSchema, updateSchema: TUpdateSchema) {
  return {
    Create: {
      Zod: createSchema,
      Type: {} as z.infer<TCreateSchema>,
    },
    Update: {
      Zod: updateSchema,
      Type: {} as z.infer<TUpdateSchema>,
    },
  };
}
