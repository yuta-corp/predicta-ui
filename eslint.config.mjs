import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Produit francophone : l'apostrophe (') est omniprésente dans le
      // texte JSX, son échappement systématique nuit à la lisibilité.
      "react/no-unescaped-entities": ["error", { forbid: [">", "}", '"'] }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Binaires MapLibre servis tels quels (worker + module partagé) :
    // fichiers minifiés tierces, pas notre code.
    "public/maplibre-gl-worker.mjs",
    "public/maplibre-gl-shared.mjs",
  ]),
]);

export default eslintConfig;
