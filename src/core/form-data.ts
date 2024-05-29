import type { Operation } from "./openapi";

export function hasFormData(operation: Operation) {
  if (!operation.requestBody) return false;
  return "multipart/form-data" in operation.requestBody.content;
}
