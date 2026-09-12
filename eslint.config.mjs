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
      // Règle 4 des « Power of 10 » (NASA) : une fonction doit tenir sur une
      // page imprimée. On ne compte que le code (ni lignes vides, ni
      // commentaires) : c'est la charge réelle de lecture qui est bornée.
      "max-lines-per-function": [
        "error",
        { max: 60, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    // Les tests n'ont pas à respecter la règle 4 : un cas de test déroule une
    // longue suite d'assertions, c'est sa nature. La règle vise le code
    // de production.
    files: ["**/__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
    rules: {
      "max-lines-per-function": "off",
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
