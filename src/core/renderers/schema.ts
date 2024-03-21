import type { ModelProperty } from "~/core/resolvers/property";
import getTemplate from "~/core/template";
import schemaTemplate from "~/templates/schema.hbs";

type SchemaTemplate = {
  importedSchemas: string[],
  name: string,
  properties: ModelProperty[],
};

export default function generateSchema(name: string, properties: ModelProperty[], importedSchemas: string[]) {
  const template = getTemplate<SchemaTemplate>(schemaTemplate);
  return template({
    name,
    properties,
    importedSchemas,
  });
}
