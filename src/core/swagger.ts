import type { OpenAPI } from "./openapi";

export default async function getSwaggerJSON(base: string, specs?: string) {
  const url = new URL(specs ?? "/swagger", base);
  const response = await fetch(url);
  const data = await response.json();
  return data as OpenAPI;
}
