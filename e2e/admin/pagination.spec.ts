import { test, expect } from "@playwright/test";

test.describe("Pagination", () => {
  test("10.1 Connections list pagination controls appear only when more than 10 connections exist", async ({
    page,
  }) => {
    // 1. Navigate to /admin/connections (only 3 seeded connections — no pagination)
    await page.goto("/admin/connections");
    await page.waitForLoadState("networkidle");

    // Pagination component renders null when totalPages <= 1
    await expect(page.getByText("Previous")).not.toBeVisible();
    await expect(page.getByText("Next")).not.toBeVisible();

    // 2. Navigate to ?page=2 directly
    await page.goto("/admin/connections?page=2");
    await page.waitForLoadState("networkidle");

    // Page renders without error and shows empty state
    await expect(
      page.getByRole("heading", { name: "Connections" }),
    ).toBeVisible();
    await expect(page.getByText("No connections yet.")).toBeVisible();
  });

  test("10.2 Invalid page query parameter defaults to page 1", async ({
    page,
  }) => {
    // ?page=abc
    await page.goto("/admin/connections?page=abc");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { name: "Connections" }),
    ).toBeVisible();
    await expect(page.getByText("No connections yet.")).not.toBeVisible();

    // ?page=-5
    await page.goto("/admin/connections?page=-5");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { name: "Connections" }),
    ).toBeVisible();
    await expect(page.getByText("No connections yet.")).not.toBeVisible();

    // ?page=0
    await page.goto("/admin/connections?page=0");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { name: "Connections" }),
    ).toBeVisible();
    await expect(page.getByText("No connections yet.")).not.toBeVisible();
  });
});
