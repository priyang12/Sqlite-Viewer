import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import reactRefresh from "eslint-plugin-react-refresh";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  globalIgnores(["dist", "coverage", "**/*config*.js", "**/*.d.ts"]),
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    plugins: {
      "react-refresh": reactRefresh,
      "react-hooks": reactHooks,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
