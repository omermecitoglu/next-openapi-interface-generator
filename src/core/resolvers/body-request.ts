import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";

export function getBodyRequest(source: RequestBodyObject | ReferenceObject) {
  if ("$ref" in source) throw new Error("Request Body references not implemented yet.");
  return source;
}
