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
      // ------------------------------------------------------------------
      // Règles de codage « Power of 10 » (NASA/JPL) adaptées au web.
      // Règle 1 — Flux de contrôle simple : pas de goto ni de labels.
      // Règle 2 — Boucles à borne fixe : interdit les boucles sans condition
      //   prouvable (while(true), condition constante) et les boucles dont la
      //   condition ne peut évoluer.
      "no-labels": "error",
      "no-constant-condition": ["error", { checkLoops: true }],
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
      // Règle 6 — Portée minimale des variables : const par défaut, ni var
      // ni variable d'arrière-plan qui fuiterait hors de son bloc.
      "block-scoped-var": "error",
      "no-var": "error",
      "prefer-const": ["error", { destructuring: "all" }],
      // Règle 7 — Vérifier retours et paramètres : aucune valeur reçue
      // (y compris les erreurs) ne doit rester inutilisée, et un `switch`
      // ne doit jamais retomber sur le cas suivant par accident.
      "no-fallthrough": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          caughtErrors: "all",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
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
