import Handlebars from "handlebars";
import type { OpenAPI } from "~/core/openapi";
import { type DocumentedOperation, resolveDocumentedOperations } from "~/core/resolvers/documented-operation";
import getTemplate from "~/core/template";
import documentationTemplate from "~/templates/documentation.hbs";

type DocumentationTemplate = {
  serviceName: string,
  packageName: string,
  envName: string,
  operations: DocumentedOperation[],
};

export default function generateDocumentation(
  serviceName: string,
  packageName: string,
  envName: string,
  paths: OpenAPI["paths"]
) {
  const template = getTemplate<DocumentationTemplate>(documentationTemplate);
  return template({
    serviceName,
    packageName,
    envName,
    operations: resolveDocumentedOperations(paths),
  });
}

Handlebars.registerHelper("serialize", (input: string) => {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
});
