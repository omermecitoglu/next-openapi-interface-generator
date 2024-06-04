import type { OperationObject } from "@omer-x/openapi-types/operation";
import type { PathItemObject, PathsObject } from "@omer-x/openapi-types/paths";

type ResolvedEndpoint = {
  method: keyof PathItemObject,
  path: keyof PathsObject,
  operation: OperationObject,
};

export default function resolveEndpoints(paths: PathsObject) {
  return Object.entries(paths).map(([path, methods]) => {
    return Object.entries(methods).reduce((collection, [method, operation]) => {
      if (typeof operation === "string" || Array.isArray(operation)) return collection;
      return [...collection, {
        method: method as keyof PathItemObject,
        path,
        operation,
      }];
    }, [] as ResolvedEndpoint[]);
  }).flat();
}
