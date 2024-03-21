import yargs from "yargs";

const argv = yargs.option("output", {
  alias: "o",
  describe: "Specify the output directory",
  type: "string",
  demandOption: false,
}).argv;

export default async function getArgument(name: string) {
  const a = argv instanceof Promise ? await argv : argv;
  return a[name] as string | undefined;
}
