import type { MediaTypeObject } from "@omer-x/openapi-types/media-type";

export default function getContentSchema(content: Record<string, MediaTypeObject>) {
  if ("multipart/form-data" in content) {
    return content["multipart/form-data"].schema;
  }
  return content["application/json"].schema;
}
