import Handlebars from "handlebars";
import type { OperationTemplate } from "~/core/resolvers/operation";
import interfaceTemplate from "~/templates/interface.hbs";

type InterfaceTemplate = {
  baseUrl: string,
  schemas: string[],
  operations: OperationTemplate[],
};

export default function generateInterface(baseUrl: string, schemas: string[], operations: OperationTemplate[]) {
  const template = Handlebars.compile<InterfaceTemplate>(interfaceTemplate);
  return template({
    baseUrl,
    schemas,
    operations,
  });
}
