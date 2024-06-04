import { resolveSchema } from "./schema-definition";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { ResponseObject, ResponsesObject } from "@omer-x/openapi-types/response";

function handleResponse(statusCode: string, resp: ResponseObject | ReferenceObject, typescript: boolean) {
  const response = getResponse(resp);
  if (statusCode.startsWith("2")) {
    if (response.content) {
      for (const [responseType, content] of Object.entries(response.content)) {
        const schema = resolveSchema(content.schema);
        switch (responseType) {
          case "application/json": {
            if (!typescript) return "return await response.json()";
            return `return await response.json() as ${schema}`;
          }
        }
      }
    }
    return "return";
  }
  return `throw new Error("${response.description}")`;
}

export function resolveResponses(responses?: ResponsesObject) {
  if (!responses) return [];
  return Object.entries(responses).map(([statusCode, response]) => (
    `case ${statusCode}: ${handleResponse(statusCode, response, false)};`
  ));
}

export function resolveResponsesForDocs(responses?: ResponsesObject) {
  if (!responses) return [];
  return Object.entries(responses).map(([statusCode, resp]) => {
    const response = getResponse(resp);
    return {
      statusCode,
      description: response.description,
    };
  });
}

export function getResponse(source: ResponseObject | ReferenceObject) {
  if ("$ref" in source) throw new Error("Response references not implemented yet.");
  return source;
}
