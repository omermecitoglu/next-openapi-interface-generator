import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .option("output", {
    alias: "o",
    describe: "Specify the output directory",
    type: "string",
    demandOption: false,
    default: "dist",
  })
  .option("framework", {
    alias: "f",
    describe: "Specify the target framework",
    type: "string",
    demandOption: false,
    default: null,
  })
  .option("schemas", {
    alias: "s",
    describe: "Specify the path for predefined zod schemas",
    type: "string",
    demandOption: false,
    default: null,
  })
  .option("definer", {
    describe: "Specify the name of definer function",
    type: "string",
    demandOption: false,
  })
  .argv;

type RemoveKeys<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

type RemoveIndex<T> = {
  [K in keyof T as
  string extends K
    ? never
    : number extends K
      ? never
      : symbol extends K
        ? never
        : K
  ]: T[K];
};

type Arguments = RemoveKeys<RemoveIndex<Awaited<typeof argv>>, "_" | "$0">;

export default async function getArgument<N extends keyof Arguments>(name: N) {
  const a = argv instanceof Promise ? await argv : argv;
  return a[name] as Arguments[N];
}
