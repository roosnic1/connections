import { test, expect } from "@playwright/test";

test.describe("Game Basics", () => {
  test("On a clean game page check the buttons state", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Shuffle" })).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "Deselect All" }),
    ).toBeDisabled();
    await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  test("On a clean game page check the buttons state after selecting cells", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "SOMMER" }).click();
    await expect(page.getByRole("button", { name: "Shuffle" })).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "Deselect All" }),
    ).toBeEnabled();
    await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();
    await page.getByRole("button", { name: "KELLER" }).click();
    await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();
    await page.getByRole("button", { name: "FREI" }).click();
    await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();
    await page.getByRole("button", { name: "HITZ" }).click();
    await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();
  });
});

test.describe("Game Play", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "SOMMER" }).click();
    await page.getByRole("button", { name: "KELLER" }).click();
    await page.getByRole("button", { name: "ZELT" }).click();
    await page.getByRole("button", { name: "WINTER" }).click();
  });

  test("Check if already guessed that shows up", async ({ page }) => {
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "already" }),
    ).toBeVisible();
    await expect(
      page.getByRole("alert").filter({ hasText: "already" }),
    ).not.toBeVisible({ timeout: 10_000 });
  });
});
