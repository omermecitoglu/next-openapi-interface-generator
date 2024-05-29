import { hasFormData } from "~/core/form-data";
import type { Operation, OperationParameter } from "~/core/openapi";
import { resolveSchema } from "~/core/resolvers/schema-definition";
import getContentSchema from "./content";

function resolveParam(param: OperationParameter, typescript: boolean) {
  if (!typescript) return param.name;
  return `${param.name}${param.required ? "" : "?"}: ${resolveSchema(param.schema)}`;
}

function resolveRequestBody(body: Exclude<Operation["requestBody"], undefined>, typescript: boolean) {
  if (!typescript) return "requestBody";
  return `requestBody${body.required ? "" : "?"}: ${resolveSchema(getContentSchema(body.content))}`;
}

function resolveFormData(body: Exclude<Operation["requestBody"], undefined>, typescript: boolean) {
  if (!typescript) return "formBody";
  return `formBody${body.required ? "" : "?"}: ${resolveSchema(getContentSchema(body.content))}`;
}

function sortRequiredParamsFirst(paramA: OperationParameter, paramB: OperationParameter) {
  if (paramA.required === paramB.required) return 0;
  return paramA.required ? -1 : 1;
}

export function resolveOperationParams(operation: Operation, typescript: boolean) {
  const resolvedParams = (operation.parameters ?? [])
    .filter(param => param.in === "path" || param.in === "query")
    .toSorted(sortRequiredParamsFirst)
    .map(p => resolveParam(p, typescript));
  const collection = [
    ...resolvedParams,
  ];
  if (operation.requestBody) {
    operation.requestBody.content;
    if (hasFormData(operation)) {
      collection.push(resolveFormData(operation.requestBody, typescript));
    } else {
      collection.push(resolveRequestBody(operation.requestBody, typescript));
    }
  }
  return collection;
}
