export function defaultOperationName(method: string, pathName: string) {
  return `${method}_${pathName.replace(/[^a-zA-Z0-9_]/g, " ").trim().replace(/\s+/g, "_")}`;
}
