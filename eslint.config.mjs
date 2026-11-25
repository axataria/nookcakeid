import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";

const compat = new FlatCompat({
  baseDirectory: fileURLToPath(new URL(".", import.meta.url)),
});

const config = [
  {
    ignores: [
      ".next*/**",
      "node_modules/**",
      "artifacts/**",
      "test-results/**",
      "playwright-report/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["src/app/layout.tsx"],
    rules: {
      // This Pages Router rule does not recognize the shared App Router root layout.
      // Keep runtime font loading so builds do not require access to Google Fonts.
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default config;
