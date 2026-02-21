import { test as base, expect, type Page } from "@playwright/test";
import path from "path";

export { expect };

/**
 * Extended test fixtures for E2E tests.
 *
 * Usage:
 *   import { test, expect } from '../fixtures';
 *
 * For admin tests that require authentication:
 *   test('admin can see connections', async ({ authedPage }) => { ... });
 *
 * For public tests (game, review):
 *   test('player can play game', async ({ page }) => { ... });
 */
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ browser }, use) => {
    const authStatePath = path.join(__dirname, ".auth", "admin.json");
    const context = await browser.newContext({ storageState: authStatePath });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});
