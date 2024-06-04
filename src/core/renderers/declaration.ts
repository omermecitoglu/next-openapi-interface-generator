import { type DeclaredOperation, resolveDeclaredOperations } from "~/core/resolvers/declared-operation";
import { resolveSchemas } from "~/core/resolvers/imported-schema";
import getTemplate from "~/core/template";
import declarationTemplate from "~/templates/declaration.hbs";
import type { PathsObject } from "@omer-x/openapi-types/paths";

type DeclarationTemplate = {
  importedSchemas: string[],
  operations: DeclaredOperation[],
};

export default function generateDeclaration(paths: PathsObject, framework: string | null) {
  const template = getTemplate<DeclarationTemplate>(declarationTemplate);
  return template({
    importedSchemas: resolveSchemas(paths),
    operations: resolveDeclaredOperations(paths, framework),
  });
}
