import type { OperationTemplate } from "~/core/resolvers/operation";
import getTemplate from "~/core/template";
import interfaceTemplate from "~/templates/interface.hbs";

type InterfaceTemplate = {
  envName: string,
  operations: OperationTemplate[],
};

export default function generateInterface(envName: string, operations: OperationTemplate[]) {
  const template = getTemplate<InterfaceTemplate>(interfaceTemplate);
  return template({
    envName,
    operations,
  });
}
