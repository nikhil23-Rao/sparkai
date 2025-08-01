import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable React escaping quotes
      "react/no-unescaped-entities": "off",

      // Disable `any` type errors
      "@typescript-eslint/no-explicit-any": "off",

      // Disable unused variables warning
      "@typescript-eslint/no-unused-vars": "off",

      // Disable React hook dependency warning
      "react-hooks/exhaustive-deps": "off",

      // Disable img tag warning from Next.js
      "@next/next/no-img-element": "off",

      // Disable alt text requirement
      "jsx-a11y/alt-text": "off",
    },
  },
];

export default eslintConfig;
