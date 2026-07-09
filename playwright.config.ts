import { defineConfig, devices } from "@playwright/test"

// E2E hermétique : le backend est mocké par page.route (voir e2e/*.spec.ts), donc
// on lance juste le serveur Next en prod avec des env factices — aucun vrai predictaapi requis.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "list" : "line",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // build déjà fait en CI ; en local `pnpm build` avant. Port dédié pour ne pas cogner un dev server.
    command: "pnpm start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_API_URL: "http://backend.invalid",
      API_KEY: "e2e-key",
    },
  },
})
