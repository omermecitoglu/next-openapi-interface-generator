import getContentSchema from "./content";
import resolveEndpoints from "./enpoint";
import { defaultOperationName } from "./operation-name";
import { resolveDocParams, resolveOperationParams } from "./operation-param";
import { getResponse } from "./response";
import { resolveSchema } from "./schema-definition";
import type { PathsObject } from "@omer-x/openapi-types/paths";
import type { ResponsesObject } from "@omer-x/openapi-types/response";

export type DeclaredOperation = {
  name: string,
  desription: string,
  parameters: string,
  docParams: {
    name: string,
    type: string,
    description: string,
  }[],
  result: string,
};

function resolveOperationResult(responses?: ResponsesObject) {
  if (!responses) return "unknown";
  const schemas = Object.values(responses).map(resp => {
    const response = getResponse(resp);
    if (!response.content) return null;
    const schema = getContentSchema(response.content);
    if (!schema) return null;
    return resolveSchema(schema);
  });
  return schemas.find(s => typeof s === "string") ?? "unknown";
}

export function resolveDeclaredOperations(paths: PathsObject, framework: string | null) {
  return resolveEndpoints(paths).map<DeclaredOperation>(({ method, path, operation }) => ({
    name: operation.operationId || defaultOperationName(method, path),
    desription: operation.description || "missing-description",
    parameters: resolveOperationParams(operation, method, true, framework).join(", "),
    docParams: resolveDocParams(operation, method, framework),
    result: resolveOperationResult(operation.responses),
  }));
}
