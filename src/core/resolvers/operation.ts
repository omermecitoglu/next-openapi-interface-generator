import { hasFormData } from "~/core/form-data";
import resolveEndpoints from "~/core/resolvers/enpoint";
import { resolveResponses } from "~/core/resolvers/response";
import { defaultOperationName } from "./operation-name";
import { getParameter, resolveOperationParams } from "./operation-param";
import type { ParameterObject } from "@omer-x/openapi-types/parameter";
import type { PathsObject } from "@omer-x/openapi-types/paths";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";

export type OperationTemplate = {
  name: string,
  method: string,
  path: string,
  parameters: string,
  searchParams: ParameterObject[],
  hasFormData: boolean,
  responses: string[],
  isCacheable: boolean,
};

function quotePathName(pathName: string, parameters: (ParameterObject | ReferenceObject)[]) {
  const pathParams = parameters.filter(p => {
    const param = getParameter(p);
    return param.in === "path";
  });
  if (pathParams.length) return `\`${pathName.replaceAll("{", "${")}\``;
  return `"${pathName}"`;
}

function getSearchParams(parameters: (ParameterObject | ReferenceObject)[]) {
  return parameters.filter(p => {
    const param = getParameter(p);
    return param.in === "query";
  }) as ParameterObject[];
}

export default function resolveOperations(paths: PathsObject, framework: string | null) {
  return resolveEndpoints(paths).map<OperationTemplate>(({ method, path, operation }) => ({
    name: operation.operationId || defaultOperationName(method, path),
    method: method.toUpperCase(),
    path: quotePathName(path, operation.parameters ?? []),
    parameters: resolveOperationParams(operation, method, false, framework).join(", "),
    searchParams: getSearchParams(operation.parameters ?? []),
    hasFormData: hasFormData(operation),
    responses: resolveResponses(operation.responses),
    isCacheable: framework === "next" && method.toUpperCase() === "GET",
  }));
}
