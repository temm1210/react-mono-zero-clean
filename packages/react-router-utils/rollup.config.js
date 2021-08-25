import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import sourcemaps from "rollup-plugin-sourcemaps";
import babel from "@rollup/plugin-babel";
import pkg from "./package.json";

const extensions = [".ts", ".tsx"];
// lodash external 설정
// https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  "lodash/fp/flow",
  "lodash/fp/join",
  "lodash/fp/split",
  "lodash/fp/mapValues",
  "lodash/fp/map",
  /@babel\/runtime/,
];

const config = {
  input: pkg.source,
  output: [
    {
      sourcemap: true,
      file: pkg.main,
      format: "cjs",
    },
    {
      sourcemap: true,
      file: pkg.module,
      format: "esm",
    },
  ],
  external,
  plugins: [
    nodeResolve({ extensions }),
    babel({ extensions, exclude: "node_modules/**", babelHelpers: "runtime" }),
    // commonjs({ extensions, include: "node_modules/**" }),
    commonjs({ extensions }),
    peerDepsExternal(),
    sourcemaps(),
    terser(),
  ],
};
export default config;
