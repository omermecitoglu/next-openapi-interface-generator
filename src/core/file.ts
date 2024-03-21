import fs from "node:fs/promises";
import path from "node:path";

export default async function createFile(content: string, fileName: string, outputDir: string, targetFolder = ".") {
  const targetPath = path.resolve(outputDir, targetFolder);
  await fs.mkdir(targetPath, { recursive: true });
  const filePath = path.resolve(targetPath, fileName);
  await fs.writeFile(filePath, content);
}
