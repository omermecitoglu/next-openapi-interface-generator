import { resolveSchemaWithNull } from "./schema-definition";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

export type ModelProperty = {
  content: string,
  description: string,
};

export default function resolveProperties(collection: Record<string, SchemaObject>, required: string[]) {
  return Object.entries(collection).map<ModelProperty>(([propertyName, property]) => {
    const isRequired = required.includes(propertyName);
    const content = [
      `${propertyName}${isRequired ? "" : "?"}:`,
      `${resolveSchemaWithNull(property)},`,
    ];
    if ("readOnly" in property && property.readOnly) content.unshift("readonly");
    return {
      content: content.join(" "),
      description: property.description || "missing description",
    };
  });
}
