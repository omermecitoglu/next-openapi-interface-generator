import "~/core/renderers/operation";
import "~/core/renderers/parameter";
import path from "node:path";
import getAppName from "./core/app";
import getArgument from "./core/arguments";
import capitalize from "./core/capitalize";
import generateConfigs from "./core/configs";
import createFile from "./core/file";
import generateDeclaration from "./core/renderers/declaration";
import generateDocumentation from "./core/renderers/documentation";
import generateInterface from "./core/renderers/interface";
import generateSchema from "./core/renderers/schema";
import { resolveSchemasFromProps } from "./core/resolvers/imported-schema";
import resolveOperations from "./core/resolvers/operation";
import resolveProperties from "./core/resolvers/property";
import generateSwaggerJson from "./core/swagger";

(async () => {
  const framework = await getArgument("framework") ?? null;

  const sourceFolder = await getArgument("source") ?? "src";
  const sourceDir = path.resolve(process.cwd(), sourceFolder);

  const outputFolder = await getArgument("output") ?? "dist";
  const outputDir = path.resolve(process.cwd(), outputFolder);

  const data = generateSwaggerJson(sourceDir);
  if (data.components.schemas) {
    for (const [schemaName, schema] of Object.entries(data.components.schemas)) {
      if (schema.type === "object") {
        const properties = resolveProperties(schema.properties, schema.required ?? []);
        const importedSchemas = resolveSchemasFromProps(schema.properties);
        const content = generateSchema(schemaName, properties, importedSchemas);
        await createFile(content, `${schemaName}.ts`, outputDir, "dist/schemas");
      }
    }
  }

  const packageName = getAppName();
  const appName = packageName.split("/").pop() ?? "unknown-service";
  const serviceName = capitalize(appName.replace(/-/g, " "));
  const envName = `${appName.replace(/-/g, "_").toUpperCase()}_BASE_URL`;

  const resolvedPaths = resolveOperations(data.paths, framework);

  const content = generateInterface(envName, resolvedPaths);
  await createFile(content, "index.js", outputDir, "dist");

  const declaration = generateDeclaration(data.paths, framework);
  await createFile(declaration, "index.d.ts", outputDir, "dist");

  const doc = generateDocumentation(serviceName, packageName, envName, data.paths);
  await createFile(doc, "README.md", outputDir);

  const configs = generateConfigs("dist", []);
  await createFile(configs + "\n", "package.json", outputDir);
})();
