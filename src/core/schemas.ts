import fs from "node:fs/promises";
import path from "node:path";
import type { ZodType } from "zod";

async function getDirectoryItems(dirPath: string) {
  const collection: string[] = [];
  const files = await fs.readdir(dirPath);
  for (const itemName of files) {
    const itemPath = path.resolve(dirPath, itemName);
    const stats = await fs.stat(itemPath);
    if (stats.isDirectory()) {
      const children = await getDirectoryItems(itemPath);
      collection.push(...children);
    } else {
      collection.push(itemPath);
    }
  }
  return collection;
}

async function getAllFiles(targetPath: string) {
  const p = path.resolve(process.cwd(), targetPath);
  const stat = await fs.lstat(p);
  if (stat.isDirectory()) {
    return await getDirectoryItems(p);
  }
  return [p];
}

async function readSchema(filePath: string) {
  const x = await import(/* webpackIgnore: true */filePath);
  return Object.entries(x).reduce((collection, [schemaName, schema]) => {
    return {
      ...collection,
      [schemaName]: schema,
    };
  }, {}) as Record<string, ZodType>;
}

async function getSchemas(targetPath: string) {
  const files = await getAllFiles(targetPath);
  return await Promise.all(files.map(readSchema));
}

export default async function findPredefinedSchemas(input: string | null) {
  if (!input) return {};
  const paths = input.split(",");
  const result = await Promise.all(paths.map(getSchemas));
  return result.flat().reduce((collection, schemas) => ({ ...collection, ...schemas }), {});
}
