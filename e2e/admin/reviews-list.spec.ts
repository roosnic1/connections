import { test, expect } from "@playwright/test";

test.describe("Reviews List Page", () => {
  test("8.1 Reviews list page renders table with correct columns", async ({
    page,
  }) => {
    await page.goto("/admin/reviews");
    await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();

    const table = page.getByRole("table");
    const tableExists = await table.count();

    await expect(
      page.getByRole("columnheader", { name: /Creation Date/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /Reviewer/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /Connection/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /Difficulty/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /Result/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /Comment/ }),
    ).toBeVisible();

    // Sortable headers contain sort links
    await expect(
      page
        .getByRole("columnheader", { name: /Creation Date/ })
        .getByRole("link"),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /Reviewer/ }).getByRole("link"),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /Difficulty/ }).getByRole("link"),
    ).toBeVisible();
  });

  test("8.2 Reviews table rows link to review detail pages", async ({
    page,
  }) => {
    await page.goto("/admin/reviews");
    await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();

    // Data rows (exclude header row)
    const rows = page
      .getByRole("row")
      .filter({ hasNot: page.getByRole("columnheader") });
    if ((await rows.count()) === 0) return;

    const firstRow = rows.first();

    // Column link order: createdAt(0) | reviewerName(1) | connection(2) | difficulty(3) | ...
    // Click reviewer name link (index 1) → navigates to review detail
    const reviewerLink = firstRow.getByRole("link").nth(1);
    const reviewerHref = await reviewerLink.getAttribute("href");
    expect(reviewerHref).toMatch(/\/admin\/reviews\/\d+/);
    await reviewerLink.click();
    await expect(page).toHaveURL(/\/admin\/reviews\/\d+/);

    // Navigate back, click Creation Date link (index 0) → also navigates to detail
    await page.goto("/admin/reviews");
    const firstRowAgain = page
      .getByRole("row")
      .filter({ hasNot: page.getByRole("columnheader") })
      .first();
    const createdAtLink = firstRowAgain.getByRole("link").nth(0);
    await createdAtLink.click();
    await expect(page).toHaveURL(/\/admin\/reviews\/\d+/);
  });

  test("8.3 Reviews table connection column links to connection-specific reviews", async ({
    page,
  }) => {
    await page.goto("/admin/reviews");
    await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();

    const table = page.getByRole("table");
    if ((await table.count()) === 0) {
      await expect(page.getByText("No reviews yet.")).toBeVisible();
      return;
    }

    const rows = page
      .getByRole("row")
      .filter({ hasNot: page.getByRole("columnheader") });
    if ((await rows.count()) === 0) return;

    // Connection link is the third link in the row (index 2)
    const firstRow = rows.first();
    const connectionLink = firstRow.getByRole("link").nth(2);
    const connectionHref = await connectionLink.getAttribute("href");
    expect(connectionHref).toMatch(/\/admin\/connections\/\d+\/reviews/);
    await connectionLink.click();
    await expect(page).toHaveURL(/\/admin\/connections\/\d+\/reviews/);
  });

  test("8.7 Reviews table shows Won/Lost badge with correct colors", async ({
    page,
  }) => {
    await page.goto("/admin/reviews");
    await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();

    if ((await page.getByRole("table").count()) === 0) return;

    // Won → bg-green-100 text-green-700 | Lost → bg-red-100 text-red-700
    const wonBadges = page.locator("span.bg-green-100.text-green-700");
    const lostBadges = page.locator("span.bg-red-100.text-red-700");

    const wonCount = await wonBadges.count();
    const lostCount = await lostBadges.count();

    if (wonCount > 0) {
      await expect(wonBadges.first()).toHaveText("Won");
    }
    if (lostCount > 0) {
      await expect(lostBadges.first()).toHaveText("Lost");
    }

    expect(wonCount + lostCount).toBeGreaterThan(0);
  });

  test("8.8 Reviews list pagination works when more than 10 reviews exist", async ({
    page,
  }) => {
    await page.goto("/admin/reviews");
    await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();

    // Pagination only renders when totalPages > 1 (requires >10 reviews)
    const nextLink = page.getByRole("link", { name: "Next" });
    if ((await nextLink.count()) === 0) return;

    // On page 1, Previous is a disabled <span>; Next is a <Link>
    await expect(page.locator("span", { hasText: "Previous" })).toBeVisible();
    await expect(page.getByText(/Page 1 of \d+/)).toBeVisible();

    // Click Next → page 2
    await nextLink.click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByRole("link", { name: "Previous" })).toBeVisible();

    // Click Previous → back to page 1
    await page.getByRole("link", { name: "Previous" }).click();
    await expect(page).toHaveURL(/page=1/);
    await expect(page.locator("span", { hasText: "Previous" })).toBeVisible();
  });
});
