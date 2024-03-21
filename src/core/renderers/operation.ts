import Handlebars from "handlebars";
import operationTemplate from "~/templates/operation.hbs";

Handlebars.registerHelper("hasRequestBody", (input: string[]) => {
  return input.includes("requestBody");
});

Handlebars.registerPartial("operation", operationTemplate);
