import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/alert.js",
  output: {
    file: "dist/alert.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [resolve(), commonjs(), terser()],
};
