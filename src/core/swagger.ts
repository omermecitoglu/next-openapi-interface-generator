import path from "node:path";
import swaggerJsdoc from "swagger-jsdoc";
import getAppVersion from "./version";
import type { OpenAPI } from "./openapi";

export default function generateSwaggerJson(sourcePath: string,) {
  const spec = swaggerJsdoc({
    apis: [
      path.resolve(sourcePath, "**", "*.ts"),
      path.resolve(sourcePath, "**", "*.js"),
    ],
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next.js API",
        version: getAppVersion(),
      },
    },
  });
  return spec as OpenAPI;
}
