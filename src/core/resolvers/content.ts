import type { Content } from "~/core/openapi";

export default function getContentSchema(content: Content) {
  return content["application/json"].schema;
}
