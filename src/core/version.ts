import fs from "node:fs";
import path from "node:path";

export default function getAppVersion(): string {
  try {
    const filePath = path.resolve(process.cwd(), "package.json");
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    return data.version;
  } catch (error) {
    return "?.?.?";
  }
}
