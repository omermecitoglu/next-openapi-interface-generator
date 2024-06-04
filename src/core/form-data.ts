import { getBodyRequest } from "./resolvers/body-request";
import type { OperationObject } from "@omer-x/openapi-types/operation";

export function hasFormData(operation: OperationObject) {
  if (!operation.requestBody) return false;
  const body = getBodyRequest(operation.requestBody);
  return "multipart/form-data" in body.content;
}
