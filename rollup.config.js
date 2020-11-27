import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";
import babel from "rollup-plugin-babel";
import sveltePreprocess from "svelte-preprocess";

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default [
  {
    input: "src/index.svelte",
    output: [
      { file: pkg.module, format: "es" },
      { file: pkg.main, format: "umd", name },
    ],
    plugins: [svelte({ preprocess: sveltePreprocess({ babel: true }) }), resolve()],
  },
  {
    input: "./src/utils/helper.js",
    output: [
      { file: "build/helper/index.mjs", format: "es" },
      { file: "build/helper/index.js", format: "umd", name: "gridHelper" },
    ],
    plugins: [babel()],
  },
];
