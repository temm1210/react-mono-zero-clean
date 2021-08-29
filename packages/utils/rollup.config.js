import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import sourcemaps from "rollup-plugin-sourcemaps";
import babel from "@rollup/plugin-babel";
import pkg from "./package.json";

const extensions = [".ts", ".tsx"];
const external = [/@babel\/runtime/];

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
    babel({ babelHelpers: "runtime", exclude: "node_modules/**", extensions }),
    commonjs({ extensions }),
    peerDepsExternal(),
    sourcemaps(),
    terser(),
  ],
};
export default config;
