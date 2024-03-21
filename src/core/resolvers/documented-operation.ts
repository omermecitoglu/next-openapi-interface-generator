import type { OpenAPI, Operation } from "~/core/openapi";
import getContentSchema from "./content";
import resolveEndpoints from "./enpoint";
import { resolveResponsesForDocs } from "./response";
import { resolveSchema } from "./schema-definition";

type DocumentedParam = {
  name: string,
  description: string,
  type: string,
  optional: boolean,
};

type DocumentedException = {
  statusCode: string,
  description: string,
};

export type DocumentedOperation = {
  name: string,
  summary: string,
  description: string,
  parameters: string,
  parametersRaw: DocumentedParam[],
  result: string,
  exceptions: DocumentedException[],
};

export function resolveDocumentedOperations(paths: OpenAPI["paths"]) {
  return resolveEndpoints(paths).map<DocumentedOperation>(({ operation }) => {
    const parameters = (operation.parameters ?? []).map<DocumentedParam>(p => ({
      name: p.name,
      description: p.description,
      type: resolveSchema(p.schema),
      optional: !p.required,
    }));
    return {
      name: operation.operationId,
      summary: operation.summary,
      description: operation.description,
      parameters: parameters.map(p => p.name).join(", "),
      parametersRaw: parameters,
      result: resolveOperationResult(operation.responses),
      exceptions: resolveResponsesForDocs(operation.responses).filter(r => !r.statusCode.startsWith("2")),
    };
  });
}

function resolveOperationResult(responses: Operation["responses"]) {
  const schemas = Object.values(responses).map(response => {
    return response.content ? resolveSchema(getContentSchema(response.content)) : null;
  });
  return schemas.find(s => typeof s === "string") ?? "unknown";
}
