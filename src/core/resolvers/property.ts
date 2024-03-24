import type { SchemaDefinition } from "~/core/openapi";
import { resolveSchemaWithNull } from "./schema-definition";

export type ModelProperty = {
  content: string,
  description: string,
};

export default function resolveProperties(collection: Record<string, SchemaDefinition>, required: string[]) {
  return Object.entries(collection).map<ModelProperty>(([propertyName, property]) => {
    const isRequired = required.includes(propertyName);
    const content = [
      `${propertyName}${isRequired ? "" : "?"}:`,
      `${resolveSchemaWithNull(property)},`,
    ];
    if (property.readOnly) content.unshift("readonly");
    return {
      content: content.join(" "),
      description: property.description,
    };
  });
}
