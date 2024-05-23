import type { SchemaDefinition } from "~/core/openapi";
import { getTupleItems, isTuple } from "~/core/tuple";

function resolveArray(items: SchemaDefinition[], isArray: boolean) {
  const schemas = items.map(resolveSchema);
  const names = schemas.join(" | ");
  return isArray ? `(${names})[]` : names;
}

function resolveObject(props: Record<string, SchemaDefinition>, required: string[]) {
  return Object.entries(props).map(([propName, propDefinition]) => {
    const isRequired = required.includes(propName);
    return `${propName}${isRequired ? "" : "?"}: ${resolveSchema(propDefinition)}`;
  });
}

function resolveEnumItem(item: string | null) {
  if (item === null) return "null";
  return `"${item}"`;
}

function resolveTuple(items: SchemaDefinition | SchemaDefinition[], length: number) {
  if (Array.isArray(items)) {
    const names = Array(length).fill(null).map((_, index) => resolveSchema(items[index % items.length]));
    return `[${names.join(", ")}]`;
  }
  const names = Array(length).fill(null).map(() => resolveSchema(items));
  return `[${names.join(", ")}]`;
}

export function resolveSchema(definition: SchemaDefinition): string {
  // TODO: handle definition.format === "date"
  if (definition.type) {
    switch (definition.type) {
      case "string": {
        if (definition.enum) {
          return definition.enum.map(resolveEnumItem).join(" | ");
        }
        return "string";
      }
      case "number": return "number";
      case "boolean": return "boolean";
      case "array": {
        if (definition.items) {
          if (definition.maxItems && definition.maxItems === definition.minItems) {
            return resolveTuple(definition.items, definition.maxItems);
          }
          if (Array.isArray(definition.items)) {
            return resolveArray(definition.items, true);
          }
          return `${resolveSchema(definition.items)}[]`;
        }
        return "unknown[]";
      }
      case "object": {
        if (definition.properties) {
          const props = resolveObject(definition.properties, definition.required ?? []);
          return `{ ${props.join(", ")} }`;
        }
        return "unknown";
      }
    }
  }
  if (definition.$ref) {
    return definition.$ref.replace("#/components/schemas/", "");
  }
  if (definition.oneOf) {
    return resolveArray(definition.oneOf, false);
  }
  return "unknown";
}

export function resolveSchemaWithNull(definition: SchemaDefinition) {
  if (definition.nullable) {
    return `${resolveSchema(definition)} | null`;
  }
  return resolveSchema(definition);
}

export function simplifySchema(resolvedSchema: string) {
  return resolvedSchema.replace(/\[|\]/g, "");
}

function isRawObject(schema: string) {
  return (/\{.*\}/).test(schema);
}

function isEverydayType(schema: string) {
  const genericSchemas = [
    "string",
    "number",
    "boolean",
    "unknown",
  ];
  return genericSchemas.includes(schema);
}

function isArraySchema(schema: string) {
  return schema.endsWith("[]");
}

function isGenericSchema(schema: string) {
  if (isArraySchema(schema)) {
    return isGenericSchema(schema.replace("[]", ""));
  }
  if (isTuple(schema)) {
    const items = getTupleItems(schema);
    if (items.every(isGenericSchema)) return true;
    throw new Error("There is a named type in the tuple. This resolver is not smart enough to handle that.");
  }
  if (isEverydayType(schema)) return true;
  if (isRawObject(schema)) return true;
  return false;
}

export function filterGenericSchemas(resolvedSchemas: string[]) {
  return resolvedSchemas.filter(s => !isGenericSchema(s));
}
