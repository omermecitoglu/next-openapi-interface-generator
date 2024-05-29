import Handlebars from "handlebars";
import operationTemplate2 from "~/templates/operation-with-form-data.hbs";
import operationTemplate from "~/templates/operation.hbs";

Handlebars.registerHelper("hasRequestBody", (input: string[]) => {
  return input.includes("requestBody");
});

Handlebars.registerPartial("operation", operationTemplate);
Handlebars.registerPartial("operationWithFormData", operationTemplate2);
