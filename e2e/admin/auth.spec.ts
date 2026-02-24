import { test, expect } from "@playwright/test";

test.describe("Authentication & Layout", () => {
  test.describe.configure({ mode: "serial" });

  // ---------------------------------------------------------------------------
  // 1.1 Unauthenticated access to /admin redirects to login page
  // ---------------------------------------------------------------------------
  test.describe("Unauthenticated access", () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("1.1 Unauthenticated access to /admin redirects to login page", async ({
      page,
    }) => {
      // 1. Navigate to /admin — expect Admin Login page
      await page.goto("/admin");
      await expect(
        page.getByRole("button", { name: "Sign in with Keycloak" }),
      ).toBeVisible();

      // 2. Navigate to /admin/connections — expect redirect to /admin/login
      await page.goto("/admin/connections");
      await expect(page).toHaveURL(/\/admin\/login/);
      await expect(
        page.getByRole("button", { name: "Sign in with Keycloak" }),
      ).toBeVisible();

      // 3. Navigate to /admin/reviews — expect redirect to /admin/login
      await page.goto("/admin/reviews");
      await expect(page).toHaveURL(/\/admin\/login/);
      await expect(
        page.getByRole("button", { name: "Sign in with Keycloak" }),
      ).toBeVisible();

      // 4. Navigate to /admin/connections/new — expect redirect to /admin/login
      await page.goto("/admin/connections/new");
      await expect(page).toHaveURL(/\/admin\/login/);
      await expect(
        page.getByRole("button", { name: "Sign in with Keycloak" }),
      ).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 1.2 Authenticated admin sees the sidebar navigation
  // ---------------------------------------------------------------------------
  test("1.2 Authenticated admin sees the sidebar navigation", async ({
    page,
  }) => {
    // 1. Navigate to /admin — expect page loads without redirecting to /admin/login
    await page.goto("/admin");
    await expect(page).not.toHaveURL(/\/admin\/login/);

    // 2. Inspect the sidebar
    await expect(page.getByText(/Logged in as:/)).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Manage Connections" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Manage Reviews" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    // 3. Click 'Manage Connections' — expect URL matches /admin/connections
    await page.getByRole("link", { name: "Manage Connections" }).click();
    await expect(page).toHaveURL(/\/admin\/connections/);

    // 4. Click 'Manage Reviews' — expect URL matches /admin/reviews
    await page.getByRole("link", { name: "Manage Reviews" }).click();
    await expect(page).toHaveURL(/\/admin\/reviews/);
  });

  // ---------------------------------------------------------------------------
  // 1.3 Admin logout redirects to home page
  // ---------------------------------------------------------------------------
  // TODO: how to test logout without failing the other tests
  /*test("1.3 Admin logout redirects to home page", async ({ page }) => {
    // 1. Navigate to /admin — expect admin page loads with sidebar
    await page.goto("/admin");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    // 2. Click 'Logout' — expect navigation to home page, sidebar gone
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForURL(/^http:\/\/localhost:3000\/?$/);
    await expect(
      page.getByRole("link", { name: "Manage Connections" }),
    ).not.toBeVisible();

    // 3. Navigate to /admin/connections — expect redirect to /admin/login
    await page.goto("/admin/connections");
    await expect(page).toHaveURL(/\/admin\/login/);
  });*/
});
