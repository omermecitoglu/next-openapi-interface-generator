import "~/core/renderers/operation";
import "~/core/renderers/parameter";
import path from "node:path";
import getArgument from "./core/arguments";
import createFile from "./core/file";
import generateInterface from "./core/renderers/interface";
import generateSchema from "./core/renderers/schema";
import { resolveSchemas, resolveSchemasFromProps } from "./core/resolvers/imported-schema";
import resolveOperations from "./core/resolvers/operation";
import resolveProperties from "./core/resolvers/property";
import readSource from "./core/source";
import getSwaggerJSON from "./core/swagger";

(async () => {
  const outputFolder = await getArgument("output") ?? "src";
  const outputDir = path.resolve(process.cwd(), outputFolder);

  const source = await readSource();
  for (const service of source.services) {
    const data = await getSwaggerJSON(service.url, service.specs);
    for (const [schemaName, schema] of Object.entries(data.components.schemas)) {
      if (schema.type === "object") {
        const properties = resolveProperties(schema.properties, schema.required ?? []);
        const importedSchemas = resolveSchemasFromProps(schema.properties);
        const content = generateSchema(schemaName, properties, importedSchemas);
        await createFile(content, `${schemaName}.ts`, outputDir, "schemas");
      }
    }
    const schemas = resolveSchemas(data.paths);
    const paths = resolveOperations(data.paths);
    const content = generateInterface(service.url, schemas, paths);
    await createFile(content, `${service.name}.ts`, outputDir);
  }
})();
