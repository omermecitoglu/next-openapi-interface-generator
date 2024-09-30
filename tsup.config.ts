import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "bin",
  entry: ["src/index.ts"],
  format: ["esm"],
  splitting: false,
  clean: true,
  external: [
    "typescript",
    "handlebars",
    "yargs",
    "change-case",
    "@omer-x/next-openapi-json-generator",
    "@omer-x/openapi-code-generator",
    "@omer-x/package-metadata",
  ],
  esbuildPlugins: [
  ],
});
