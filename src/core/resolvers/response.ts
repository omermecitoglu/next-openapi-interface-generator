import type { Operation } from "~/core/openapi";
import { resolveSchema } from "./schema-definition";

function handleResponse(statusCode: string, response: Operation["responses"]["200"], typescript: boolean) {
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

export function resolveResponses(responses: Operation["responses"]) {
  return Object.entries(responses).map(([statusCode, response]) => (
    `case ${statusCode}: ${handleResponse(statusCode, response, true)};`
  ));
}
