import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

// Load .env.test so DATABASE_URL and other vars are available
// when the webServer and globalSetup blocks are evaluated.
// In CI, these come from GitHub secrets / workflow env instead.
if (!process.env.CI) {
  config({ path: ".env.test" });
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html"], ["github"]] : [["html"], ["list"]],
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL,
    locale: "en",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/admin.json",
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: process.env.CI
      ? "npx prisma migrate reset --force && npm run build && npm start"
      : "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: process.env.CI ? 120_000 : 60_000,
  },
});
