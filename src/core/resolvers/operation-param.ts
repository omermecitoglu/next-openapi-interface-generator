import { hasFormData } from "~/core/form-data";
import { resolveSchema } from "~/core/resolvers/schema-definition";
import { getBodyRequest } from "./body-request";
import getContentSchema from "./content";
import type { OperationObject } from "@omer-x/openapi-types/operation";
import type { ParameterObject } from "@omer-x/openapi-types/parameter";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";

function resolveParam(parameter: ParameterObject | ReferenceObject, typescript: boolean) {
  const param = getParameter(parameter);
  if (!typescript) return param.name;
  return `${param.name}${param.required ? "" : "?"}: ${resolveSchema(param.schema)}`;
}

function resolveRequestBody(requestBody: RequestBodyObject | ReferenceObject, typescript: boolean) {
  const body = getBodyRequest(requestBody);
  if (!typescript) return "requestBody";
  return `requestBody${body.required ? "" : "?"}: ${resolveSchema(getContentSchema(body.content))}`;
}

function resolveFormData(requestBody: RequestBodyObject | ReferenceObject, typescript: boolean) {
  const body = getBodyRequest(requestBody);
  if (!typescript) return "formBody";
  return `formBody${body.required ? "" : "?"}: ${resolveSchema(getContentSchema(body.content))}`;
}

function sortRequiredParamsFirst(a: ParameterObject | ReferenceObject, b: ParameterObject | ReferenceObject) {
  const paramA = getParameter(a);
  const paramB = getParameter(b);
  if (paramA.required === paramB.required) return 0;
  return paramA.required ? -1 : 1;
}

export function resolveOperationParams(operation: OperationObject, method: string, typescript: boolean, framework: string | null) {
  const resolvedParams = (operation.parameters ?? [])
    .filter(param => "in" in param && (param.in === "path" || param.in === "query"))
    .toSorted(sortRequiredParamsFirst)
    .map(p => resolveParam(p, typescript));
  const collection = [
    ...resolvedParams,
  ];
  if (operation.requestBody) {
    if (hasFormData(operation)) {
      collection.push(resolveFormData(operation.requestBody, typescript));
    } else {
      collection.push(resolveRequestBody(operation.requestBody, typescript));
    }
  }
  if (framework === "next" && method.toUpperCase() === "GET") {
    collection.unshift(typescript ? "cacheTag: string | null" : "cacheTag");
  }
  return collection;
}

function resolveDocParam(parameter: ParameterObject | ReferenceObject) {
  const param = getParameter(parameter);
  return {
    name: param.name,
    type: resolveSchema(param.schema),
    description: param.description || "missing-description",
  };
}

export function resolveDocParams(operation: OperationObject, method: string, framework: string | null) {
  const resolvedParams = (operation.parameters ?? [])
    .filter(param => "in" in param && (param.in === "path" || param.in === "query"))
    .toSorted(sortRequiredParamsFirst)
    .map(resolveDocParam);
  const collection = [
    ...resolvedParams,
  ];
  if (operation.requestBody) {
    const body = getBodyRequest(operation.requestBody);
    collection.push({
      name: hasFormData(operation) ? "formBody" : "requestBody",
      type: resolveSchema(getContentSchema(body.content)),
      description: "Request body",
    });
  }
  if (framework === "next" && method.toUpperCase() === "GET") {
    collection.unshift({
      name: "cacheTag",
      type: "string | null",
      description: "Tag name of Next.js fetch cache",
    });
  }
  return collection;
}

export function getParameter(source: ParameterObject | ReferenceObject) {
  if ("$ref" in source) throw new Error("Parameter references not implemented yet.");
  return source;
}
