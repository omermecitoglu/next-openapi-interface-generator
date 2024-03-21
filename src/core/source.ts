import fs from "node:fs/promises";
import path from "node:path";

type Service = {
  name: string,
  url: string,
  specs?: string,
};

type Configurations = {
  services: Service[],
};

export default async function readSource() {
  const sourcePath = path.resolve(process.cwd(), "source.json");
  const content = await fs.readFile(sourcePath, "utf-8");
  return JSON.parse(content) as Configurations;
}
