import { execSync } from "child_process";
import { mkdirSync } from "fs";
import { request } from "@playwright/test";

async function globalSetup(): Promise<void> {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL must be set to run E2E tests");

  // Seed fixture data via tsx (avoids ESM/CJS conflict in Playwright's loader)
  execSync("npx tsx e2e/seed.ts", { stdio: "inherit" });

  // Create admin session via test-auth API (server is up at this point)
  const e2eAuthSecret = process.env.E2E_AUTH_SECRET;
  if (!e2eAuthSecret) {
    console.warn(
      "[global-setup] E2E_AUTH_SECRET not set — skipping admin auth fixture",
    );
    return;
  }

  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

  mkdirSync("e2e/.auth", { recursive: true });

  const requestContext = await request.newContext({ baseURL });

  try {
    const response = await requestContext.post("/api/test-auth", {
      data: { secret: e2eAuthSecret },
    });

    if (!response.ok()) {
      const body = await response.text();
      throw new Error(
        `Failed to create test auth session: ${response.status()} ${body}`,
      );
    }

    await requestContext.storageState({ path: "e2e/.auth/admin.json" });
    console.log(
      "[global-setup] Admin auth state saved to e2e/.auth/admin.json",
    );
  } finally {
    await requestContext.dispose();
  }
}

export default globalSetup;
