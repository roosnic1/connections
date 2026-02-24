import { execSync } from "child_process";

async function globalSetup(): Promise<void> {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL must be set to run E2E tests");

  // Seed fixture data and test user via tsx (avoids ESM/CJS conflict in Playwright's loader)
  execSync("npx tsx e2e/seed.ts", { stdio: "inherit" });
}

export default globalSetup;
