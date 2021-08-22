import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import sourcemaps from "rollup-plugin-sourcemaps";
import babel from "@rollup/plugin-babel";
import pkg from "./package.json";

const extensions = [".js", ".ts"];
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
    resolve({ extensions }),
    babel({ babelHelpers: "runtime", exclude: "node_modules/**", extensions }),
    commonjs({ extensions, transformMixedEsModules: true }),
    peerDepsExternal(),
    sourcemaps(),
    terser(),
  ],
};
export default config;
