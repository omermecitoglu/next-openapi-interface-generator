import getContentSchema from "./content";
import resolveEndpoints from "./enpoint";
import { defaultOperationName } from "./operation-name";
import { getParameter } from "./operation-param";
import { resolveResponsesForDocs } from "./response";
import { resolveSchema } from "./schema-definition";
import type { PathsObject } from "@omer-x/openapi-types/paths";
import type { ResponsesObject } from "@omer-x/openapi-types/response";

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

export function resolveDocumentedOperations(paths: PathsObject) {
  return resolveEndpoints(paths).map<DocumentedOperation>(({ method, path, operation }) => {
    const parameters = (operation.parameters ?? []).map<DocumentedParam>(p => {
      const param = getParameter(p);
      return {
        name: param.name,
        description: p.description || "missing description",
        type: resolveSchema(param.schema),
        optional: !param.required,
      };
    });
    return {
      name: operation.operationId || defaultOperationName(method, path),
      summary: operation.summary || "missing summary",
      description: operation.description || "missing description",
      parameters: parameters.map(p => p.name).join(", "),
      parametersRaw: parameters,
      result: resolveOperationResult(operation.responses),
      exceptions: resolveResponsesForDocs(operation.responses).filter(r => !r.statusCode.startsWith("2")),
    };
  });
}

function resolveOperationResult(responses?: ResponsesObject) {
  if (!responses) return "unknown";
  const schemas = Object.values(responses).map(response => {
    if (response && "content" in response && response.content) {
      return resolveSchema(getContentSchema(response.content));
    }
    return null;
  });
  return schemas.find(s => typeof s === "string") ?? "unknown";
}
