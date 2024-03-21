import type { OpenAPI, OperationParameter } from "~/core/openapi";
import resolveEndpoints from "~/core/resolvers/enpoint";
import { resolveResponses } from "~/core/resolvers/response";
import { resolveOperationParams } from "./operation-param";

export type OperationTemplate = {
  name: string,
  method: string,
  path: string,
  parameters: string,
  searchParams: OperationParameter[],
  responses: string[],
};

function quotePathName(pathName: string, parameters: OperationParameter[]) {
  const pathParams = parameters.filter(p => p.in === "path");
  if (pathParams.length) return `\`${pathName.replaceAll("{", "${")}\``;
  return `"${pathName}"`;
}

function getSearchParams(parameters: OperationParameter[]) {
  return parameters.filter(param => param.in === "query");
}

export default function resolveOperations(paths: OpenAPI["paths"]) {
  return resolveEndpoints(paths).map<OperationTemplate>(({ method, path, operation }) => ({
    name: operation.operationId,
    method: method.toUpperCase(),
    path: quotePathName(path, operation.parameters ?? []),
    parameters: resolveOperationParams(operation, false).join(", "),
    searchParams: getSearchParams(operation.parameters ?? []),
    responses: resolveResponses(operation.responses),
  }));
}
