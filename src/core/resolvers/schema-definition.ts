import { getTupleItems, isTuple } from "~/core/tuple";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

function resolveArray(items: SchemaObject[], isArray: boolean) {
  const schemas = items.map(resolveSchema);
  const names = schemas.join(" | ");
  return isArray ? `(${names})[]` : names;
}

function resolveObject(props: Record<string, SchemaObject>, required: string[]) {
  return Object.entries(props).map(([propName, propDefinition]) => {
    const isRequired = required.includes(propName);
    return `${propName}${isRequired ? "" : "?"}: ${resolveSchema(propDefinition)}`;
  });
}

function resolveEnumItem(item: string | null) {
  if (item === null) return "null";
  return `"${item}"`;
}

function resolveTuple(items: SchemaObject | SchemaObject[], length: number) {
  if (Array.isArray(items)) {
    const names = Array(length).fill(null).map((_, index) => resolveSchema(items[index % items.length]));
    return `[${names.join(", ")}]`;
  }
  const names = Array(length).fill(null).map(() => resolveSchema(items));
  return `[${names.join(", ")}]`;
}

export function resolveSchema(definition?: SchemaObject): string {
  if (!definition) return "unknown";
  if ("$ref" in definition) {
    return definition.$ref.replace("#/components/schemas/", "");
  }
  switch (definition.type) {
    case "string": {
      if (definition.format === "binary") return "File";
      // TODO: handle definition.format === "date"
      if (definition.enum) {
        return definition.enum.map(resolveEnumItem).join(" | ");
      }
      return "string";
    }
    case "number": return "number";
    case "boolean": return "boolean";
    case "array": {
      if (definition.maxItems && definition.maxItems === definition.minItems) {
        return resolveTuple(definition.items, definition.maxItems);
      }
      if (Array.isArray(definition.items)) {
        return resolveArray(definition.items, true);
      }
      return `${resolveSchema(definition.items)}[]`;
    }
    case "object": {
      const props = resolveObject(definition.properties, definition.required ?? []);
      return `{ ${props.join(", ")} }`;
    }
  }
  if (definition.oneOf) {
    return resolveArray(definition.oneOf, false);
  }
  return "unknown";
}

export function resolveSchemaWithNull(definition: SchemaObject) {
  if ("nullable" in definition && definition.nullable) {
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
