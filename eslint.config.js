import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettier,
  {
    // Backend files — Node.js globals
    files: ["backend.js", "server/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Frontend files — Browser globals
    files: ["frontend/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];