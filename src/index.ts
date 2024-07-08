import path from "node:path";
import generateOpenApiSpec from "@omer-x/next-openapi-json-generator";
import * as codegen from "@omer-x/openapi-code-generator";
import getAppName from "./core/app";
import getArgument from "./core/arguments";
import capitalize from "./core/capitalize";
import createFile from "./core/file";
import findPredefinedSchemas from "./core/schemas";

(async () => {
  const outputFolder = await getArgument("output") ?? "dist";
  const outputDir = path.resolve(process.cwd(), outputFolder);

  const framework = await getArgument("framework") ?? null;

  const schemaPaths = await getArgument("schemas") ?? null;
  const schemas = await findPredefinedSchemas(schemaPaths);

  const spec = await generateOpenApiSpec(schemas);
  if (!spec.paths) throw new Error("Couldn't find any valid path");

  if (spec.components?.schemas) {
    for (const [schemaName, schema] of Object.entries(spec.components.schemas)) {
      if (schema.type !== "object") continue;
      const content = codegen.generateSchemaCode(schemaName, schema);
      await createFile(content, `${schemaName}.ts`, outputDir, "dist/schemas");
    }
  }

  const packageName = getAppName();
  const appName = packageName.split("/").pop() ?? "unknown-service";
  const serviceName = capitalize(appName.replace(/-/g, " "));
  const envName = `${appName.replace(/-/g, "_").toUpperCase()}_BASE_URL`;

  await createFile(codegen.generateInterface(envName, spec.paths, framework), "index.js", outputDir, "dist");
  await createFile(codegen.generateDeclaration(spec.paths, framework), "index.d.ts", outputDir, "dist");
  await createFile(codegen.generateDocumentation(serviceName, packageName, envName, spec.paths), "README.md", outputDir);
  await createFile(codegen.generateConfigs("dist", []) + "\n", "package.json", outputDir);
})();
