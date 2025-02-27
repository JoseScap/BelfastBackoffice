import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Configuración base que se usa siempre
const baseConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

// Configuración adicional para CI
const ciConfig = [
  {
    rules: {
      "no-warning-comments": process.env.CI ? ["error", { 
        terms: ["TODO", "FIXME"],
        location: "anywhere"
      }] : "off"
    }
  }
];

const eslintConfig = [...baseConfig, ...ciConfig];

export default eslintConfig;
