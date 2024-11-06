import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser, // Browser globals zoals `window`
        ...globals.node     // Node globals zoals `require` en `__dirname`
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: pluginReact
    },
    rules: {
      ...pluginJs.configs.recommended.rules,  // Voeg de regels van de standaard JS-configuratie toe
      ...tseslint.configs.recommended.rules,  // Voeg de regels van de TypeScript-configuratie toe
      ...pluginReact.configs.recommended.rules,  // Voeg de regels van de React-configuratie toe
      "no-undef": "off", // Schakel 'no-undef' uit voor Node globals
      "@typescript-eslint/no-require-imports": "off", // Sta `require()`-imports toe
      "react/react-in-jsx-scope": "off" // Niet nodig bij React 17+
    },
    settings: {
      react: {
        version: "detect" // Laat ESLint de juiste React-versie detecteren
      }
    }
  }
];
