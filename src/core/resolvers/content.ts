import type { Content } from "~/core/openapi";

export default function getContentSchema(content: Content) {
  if ("multipart/form-data" in content) {
    return content["multipart/form-data"].schema;
  }
  return (content["application/json"] as Content["application/json"]).schema;
}
