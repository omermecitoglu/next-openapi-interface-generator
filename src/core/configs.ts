import fs from "node:fs";
import path from "node:path";

function filterDependencies(deps: Record<string, string> | undefined, whiteList: string[]) {
  const entries = Object.entries(deps ?? {}).filter(([name]) => whiteList.includes(name));
  return entries.length ? Object.fromEntries(entries) : undefined;
}

export default function generateConfigs(outputFolder: string, dependencies: string[]) {
  const filePath = path.resolve(process.cwd(), "package.json");
  const content = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(content);
  return JSON.stringify({
    ...data,
    files: [
      `${outputFolder}/`,
    ],
    exports: {
      ".": {
        import: `./${outputFolder}/index.js`,
        types: `./${outputFolder}/index.d.ts`,
      },
      "./*": `./${outputFolder}/schemas/*.ts`,
    },
    scripts: {
      test: "echo \"Error: no test specified\" && exit 1",
    },
    dependencies: filterDependencies(data.dependencies, dependencies),
    devDependencies: filterDependencies(data.devDependencies, dependencies),
    optionalDependencies: filterDependencies(data.optionalDependencies, dependencies),
  }, null, 2);
}
