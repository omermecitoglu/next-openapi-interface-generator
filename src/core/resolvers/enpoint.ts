import type { OpenAPI } from "~/core/openapi";

type ResolvedEndpoint = {
  method: keyof OpenAPI["paths"][string],
  path: keyof OpenAPI["paths"],
  operation: OpenAPI["paths"][string]["get"],
};

export default function resolveEndpoints(paths: OpenAPI["paths"]) {
  return Object.entries(paths).map(([path, methods]) => {
    return Object.entries(methods).map<ResolvedEndpoint>(([method, operation]) => ({
      method: method as keyof OpenAPI["paths"][string],
      path,
      operation,
    }));
  }).flat();
}
