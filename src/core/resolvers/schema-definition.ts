import type { SchemaDefinition } from "~/core/openapi";

function resolveArray(items: SchemaDefinition[], isArray: boolean) {
  const schemas = items.map(resolveSchema);
  const names = schemas.join(" | ");
  return isArray ? `(${names})[]` : names;
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
      case "object": return "unknown";
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

export function simplifySchema(resolvedSchema: string) {
  return resolvedSchema.replace(/\[|\]/g, "");
}

export function filterGenericSchemas(resolvedSchemas: string[]) {
  const genericSchemas = [
    "string",
    "number",
    "unknown",
  ];
  return resolvedSchemas.filter(s => !genericSchemas.includes(s));
}
