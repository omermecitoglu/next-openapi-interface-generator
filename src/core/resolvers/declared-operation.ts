import type { OpenAPI, Operation } from "~/core/openapi";
import getContentSchema from "./content";
import resolveEndpoints from "./enpoint";
import { resolveOperationParams } from "./operation-param";
import { resolveSchema } from "./schema-definition";

export type DeclaredOperation = {
  name: string,
  parameters: string,
  result: string,
};

function resolveOperationResult(responses: Operation["responses"]) {
  const schemas = Object.values(responses).map(response => {
    return response.content ? resolveSchema(getContentSchema(response.content)) : null;
  });
  return schemas.find(s => typeof s === "string") ?? "unknown";
}

export function resolveDeclaredOperations(paths: OpenAPI["paths"]) {
  return resolveEndpoints(paths).map<DeclaredOperation>(({ operation }) => ({
    name: operation.operationId,
    parameters: resolveOperationParams(operation, true).join(", "),
    result: resolveOperationResult(operation.responses),
  }));
}
