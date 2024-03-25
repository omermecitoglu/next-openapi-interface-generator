import type { SchemaDefinition } from "~/core/openapi";

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

export function filterGenericSchemas(resolvedSchemas: string[]) {
  const genericSchemas = [
    "string",
    "number",
    "boolean",
    "unknown",
  ];
  return resolvedSchemas.filter(s => !genericSchemas.includes(s) && !isRawObject(s));
}
