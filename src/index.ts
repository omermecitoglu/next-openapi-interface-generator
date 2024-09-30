import path from "node:path";
import generateOpenApiSpec from "@omer-x/next-openapi-json-generator";
import * as codegen from "@omer-x/openapi-code-generator";
import getPackageMetadata from "@omer-x/package-metadata";
import * as changeCase from "change-case";
import getArgument from "./core/arguments";
import createFile from "./core/file";
import findPredefinedSchemas from "./core/schemas";

(async () => {
  const outputFolder = await getArgument("output");
  const outputDir = path.resolve(process.cwd(), outputFolder);

  const framework = await getArgument("framework");

  const schemaPaths = await getArgument("schemas");
  const schemas = await findPredefinedSchemas(schemaPaths);

  const routeDefinerName = await getArgument("definer");

  const spec = await generateOpenApiSpec(schemas, {
    routeDefinerName,
  });
  if (!spec.paths) throw new Error("Couldn't find any valid path");

  if (spec.components.schemas) {
    for (const [schemaName, schema] of Object.entries(spec.components.schemas)) {
      if (!schema.type) continue;
      const content = codegen.generateSchemaCode(schemaName, schema);
      await createFile(content, `${schemaName}.ts`, outputDir, "dist/schemas");
    }
  }

  const { packageName, moduleName: appName } = getPackageMetadata();
  const serviceName = changeCase.capitalCase(appName);
  const envName = `${changeCase.constantCase(appName)}_BASE_URL`;

  await createFile(codegen.generateInterface(envName, spec.paths, framework), "index.js", outputDir, "dist");
  await createFile(codegen.generateDeclaration(spec.paths, framework), "index.d.ts", outputDir, "dist");
  await createFile(codegen.generateDocumentation(serviceName, packageName, envName, spec.paths), "README.md", outputDir);
  await createFile(codegen.generateConfigs("dist", []) + "\n", "package.json", outputDir);
})();
