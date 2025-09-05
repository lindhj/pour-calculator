import globals from "globals";
import js from "@eslint/js";
import solid from "eslint-plugin-solid/configs/recommended";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  solid,
  prettier,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
