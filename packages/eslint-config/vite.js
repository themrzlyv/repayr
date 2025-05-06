import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
// import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import pluginImport from "eslint-plugin-import";
import { baseConfig } from "./base.js";

/** @type {import('eslint').Linter.Config[]} */
export const viteConfig = [
  ...baseConfig,
  // pluginJs.configs.recommended,
  // ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  // prettier,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["vite.config.*", "eslint.config.*"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      "jsx-a11y": jsxA11y,
      import: pluginImport,
      prettier: pluginPrettier,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "jsx-a11y/no-autofocus": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "no-unsafe-optional-chaining": [
        "off",
        {
          disallowArithmeticOperators: false,
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": ["error"],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "sibling",
            "parent",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "*.css",
              group: "index",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
];
