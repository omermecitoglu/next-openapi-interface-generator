import { getTupleItems, isTuple } from "~/core/tuple";
import { getBodyRequest } from "./body-request";
import getContentSchema from "./content";
import resolveEndpoints from "./enpoint";
import { getResponse } from "./response";
import { filterGenericSchemas, resolveSchema, simplifySchema } from "./schema-definition";
import type { PathsObject } from "@omer-x/openapi-types/paths";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ResponsesObject } from "@omer-x/openapi-types/response";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

function resolveRequestSchemas(body?: RequestBodyObject | ReferenceObject) {
  if (!body) return [];
  const requestBody = getBodyRequest(body);
  return [resolveSchema(getContentSchema(requestBody.content))];
}

function resolveResponseSchemas(responses?: ResponsesObject) {
  if (!responses) return [];
  return Object.values(responses).map(resp => {
    const response = getResponse(resp);
    return Object.values(response.content ?? {}).map(content => {
      return simplifySchema(resolveSchema(content.schema));
    }).flat();
  }).flat();
}

function extractTuples(collection: string[]) {
  return collection.map(schema => {
    if (isTuple(schema.replaceAll("[]", ""))) {
      return getTupleItems(schema);
    }
    return schema;
  }).flat();
}

export function resolveSchemas(paths: PathsObject) {
  const collection = resolveEndpoints(paths).map(({ operation }) => ([
    ...resolveRequestSchemas(operation.requestBody),
    ...resolveResponseSchemas(operation.responses),
  ])).flat();
  const uniqueCollection = Array.from(new Set(extractTuples(collection)));
  return filterGenericSchemas(uniqueCollection).toSorted();
}

function resolvePropDefinition(definition: SchemaObject) {
  if ("$ref" in definition) {
    return [definition.$ref.replace("#/components/schemas/", "")];
  }
  if (definition.type === "array") {
    if (Array.isArray(definition.items)) {
      return definition.items.map<string[]>(resolvePropDefinition).flat();
    }
    return [resolveSchema(definition.items)];
  }
  if (definition.oneOf) {
    return definition.oneOf.map<string[]>(resolvePropDefinition).flat();
  }
  if (definition.anyOf) {
    return definition.anyOf.map<string[]>(resolvePropDefinition).flat();
  }
  return [];
}

export function resolveSchemasFromProps(props: Record<string, SchemaObject>) {
  const collection = Object.values(props).map(resolvePropDefinition).flat();
  const uniqueCollection = Array.from(new Set(extractTuples(collection)));
  return filterGenericSchemas(uniqueCollection).toSorted();
}
