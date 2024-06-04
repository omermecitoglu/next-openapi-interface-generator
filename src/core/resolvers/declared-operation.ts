import getContentSchema from "./content";
import resolveEndpoints from "./enpoint";
import { defaultOperationName } from "./operation-name";
import { resolveOperationParams } from "./operation-param";
import { getResponse } from "./response";
import { resolveSchema } from "./schema-definition";
import type { PathsObject } from "@omer-x/openapi-types/paths";
import type { ResponsesObject } from "@omer-x/openapi-types/response";

export type DeclaredOperation = {
  name: string,
  parameters: string,
  result: string,
};

function resolveOperationResult(responses?: ResponsesObject) {
  if (!responses) return "unknown";
  const schemas = Object.values(responses).map(resp => {
    if (!resp) return null;
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
    parameters: resolveOperationParams(operation, method, true, framework).join(", "),
    result: resolveOperationResult(operation.responses),
  }));
}
