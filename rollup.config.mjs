import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
    exports: "named",
    preserveModules: true,
    preserveModulesRoot: "src",
  },
  plugins: [json(), typescript(), commonjs(), nodeResolve()],
};
