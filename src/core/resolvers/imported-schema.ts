import type { OpenAPI, Operation, SchemaDefinition } from "~/core/openapi";
import getContentSchema from "./content";
import resolveEndpoints from "./enpoint";
import { filterGenericSchemas, resolveSchema, simplifySchema } from "./schema-definition";

function resolveRequestSchemas(requestBody: Operation["requestBody"]) {
  if (!requestBody) return [];
  return [resolveSchema(getContentSchema(requestBody.content))];
}

function resolveResponseSchemas(responses: Operation["responses"]) {
  return Object.values(responses).map(response => {
    return Object.values(response.content ?? {}).map(content => {
      return simplifySchema(resolveSchema(content.schema));
    }).flat();
  }).flat();
}

export function resolveSchemas(paths: OpenAPI["paths"]) {
  const collection = resolveEndpoints(paths).map(({ operation }) => ([
    ...resolveRequestSchemas(operation.requestBody),
    ...resolveResponseSchemas(operation.responses),
  ])).flat();
  const uniqueCollection = Array.from(new Set(collection));
  return filterGenericSchemas(uniqueCollection).toSorted();
}

function resolvePropDefinition(definition: SchemaDefinition) {
  if (definition.type === "array" && definition.items) {
    if (Array.isArray(definition.items)) {
      return definition.items.map<string[]>(resolvePropDefinition).flat();
    }
    return [resolveSchema(definition.items)];
  }
  if (definition.$ref) {
    return [definition.$ref.replace("#/components/schemas/", "")];
  }
  if (definition.oneOf) {
    return definition.oneOf.map<string[]>(resolvePropDefinition).flat();
  }
  return [];
}

export function resolveSchemasFromProps(props: Record<string, SchemaDefinition>) {
  const collection = Object.values(props).map(resolvePropDefinition).flat();
  const uniqueCollection = Array.from(new Set(collection));
  return filterGenericSchemas(uniqueCollection).toSorted();
}
