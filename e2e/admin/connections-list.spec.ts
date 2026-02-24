import { test, expect } from "@playwright/test";

// Seeded data:
//   Connection id=1 → PUBLISHED, publishDate = today   → bg-rose-100 card
//   Connection id=2 → REVIEW,    no publish date        → bg-orange-100 card
//   Connection id=3 → DRAFT,     no publish date        → bg-gray-100 card

test.describe("Connections List Page", () => {
  test("2.1 Connections list displays all seeded connections", async ({
    page,
  }) => {
    await page.goto("/admin/connections");
    await expect(
      page.getByRole("heading", { name: "Connections" }),
    ).toBeVisible();

    const publishedCard = page.getByRole("article", { name: /Connection 1:/ });
    const reviewCard = page.getByRole("article", { name: /Connection 2:/ });
    const draftCard = page.getByRole("article", { name: /Connection 3:/ });

    await expect(publishedCard).toBeVisible();
    await expect(reviewCard).toBeVisible();
    await expect(draftCard).toBeVisible();

    // PUBLISHED card (id=1) category titles and words
    await expect(publishedCard.getByText("Fussballspieler")).toBeVisible();
    await expect(
      publishedCard.getByText(/sommer,\s*keller,\s*hitz,\s*frei/i),
    ).toBeVisible();
    await expect(publishedCard.getByText("Musikerinnen")).toBeVisible();
    await expect(publishedCard.getByText("Zürcher wege")).toBeVisible();
    await expect(publishedCard.getByText("Spät")).toBeVisible();

    // REVIEW card (id=2) category titles
    await expect(reviewCard.getByText("____grund")).toBeVisible();
    await expect(
      reviewCard.getByText(/ab,\s*letzi,\s*unter,\s*hinter/i),
    ).toBeVisible();
    await expect(reviewCard.getByText("Areale")).toBeVisible();
    await expect(reviewCard.getByText("Biere")).toBeVisible();
    await expect(reviewCard.getByText("Schmiedutensielien")).toBeVisible();

    // DRAFT card (id=3) category titles
    await expect(
      draftCard.getByText("Elemente von Stadtzürcherquartieren"),
    ).toBeVisible();
    await expect(
      draftCard.getByText(/Turm,\s*Anker,\s*Kleeblatt,\s*Hufeisen/),
    ).toBeVisible();
    await expect(draftCard.getByText("Insekten")).toBeVisible();
    await expect(draftCard.getByText("Spionequipment")).toBeVisible();
    await expect(draftCard.getByText("Fussballclubs")).toBeVisible();

    // PUBLISHED card shows a date; REVIEW and DRAFT show 'No date set'
    await expect(publishedCard.getByText("No date set")).not.toBeVisible();
    await expect(reviewCard.getByText("No date set")).toBeVisible();
    await expect(draftCard.getByText("No date set")).toBeVisible();

    // Every card shows Creation Date and Modification Date labels
    for (const card of [publishedCard, reviewCard, draftCard]) {
      await expect(card.getByText(/Creation Date:/)).toBeVisible();
      await expect(card.getByText(/Modification Date:/)).toBeVisible();
    }

    // 'New Connection' button navigates to the create form
    await page.getByRole("link", { name: "New Connection" }).click();
    await expect(page).toHaveURL(/\/admin\/connections\/new/);
  });

  test("2.2 State filter bar filters connections by state", async ({
    page,
  }) => {
    await page.goto("/admin/connections");
    await expect(
      page.getByRole("heading", { name: "Connections" }),
    ).toBeVisible();

    const publishedCard = page.getByRole("article", { name: /Connection 1:/ });
    const reviewCard = page.getByRole("article", { name: /Connection 2:/ });
    const draftCard = page.getByRole("article", { name: /Connection 3:/ });

    // All three connections visible; 'All' button is active (bg-black)
    await expect(publishedCard).toBeVisible();
    await expect(reviewCard).toBeVisible();
    await expect(draftCard).toBeVisible();
    await expect(
      page.getByRole("button", { name: "All", exact: true }),
    ).toHaveClass(/bg-black/);

    // Filter: Draft → only DRAFT card shown
    await page.getByRole("button", { name: "Draft", exact: true }).click();
    await expect(page).toHaveURL(/state=DRAFT/);
    await expect(page).toHaveURL(/page=1/);
    await expect(draftCard).toBeVisible();
    await expect(reviewCard).not.toBeVisible();
    await expect(publishedCard).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Draft", exact: true }),
    ).toHaveClass(/bg-black/);

    // Filter: Review → only REVIEW card shown
    await page.getByRole("button", { name: "Review", exact: true }).click();
    await expect(page).toHaveURL(/state=REVIEW/);
    await expect(draftCard).not.toBeVisible();
    await expect(reviewCard).toBeVisible();
    await expect(publishedCard).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Review", exact: true }),
    ).toHaveClass(/bg-black/);

    // Filter: Published → only PUBLISHED card shown
    await page.getByRole("button", { name: "Published", exact: true }).click();
    await expect(page).toHaveURL(/state=PUBLISHED/);
    await expect(draftCard).not.toBeVisible();
    await expect(reviewCard).not.toBeVisible();
    await expect(publishedCard).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Published", exact: true }),
    ).toHaveClass(/bg-black/);

    // Filter: All → no state param; all three cards visible again
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(page).not.toHaveURL(/state=/);
    await expect(publishedCard).toBeVisible();
    await expect(reviewCard).toBeVisible();
    await expect(draftCard).toBeVisible();
  });

  test("2.3 Edit button is only enabled for DRAFT connections", async ({
    page,
  }) => {
    await page.goto("/admin/connections");
    await expect(
      page.getByRole("heading", { name: "Connections" }),
    ).toBeVisible();

    // DRAFT card (id=3) — Edit is rendered as a <Link> (role="link"), no opacity-50
    const draftCard = page.getByRole("article", { name: /Connection 3:/ });
    const draftEditLink = draftCard.getByRole("link", { name: "Edit" });
    await expect(draftEditLink).toBeVisible();
    await expect(draftEditLink).not.toHaveClass(/opacity-50/);

    // Click the enabled Edit link → navigates to /admin/connections/3
    await draftEditLink.click();
    await expect(page).toHaveURL(/\/admin\/connections\/3$/);

    // Back to list — REVIEW card Edit is a <span> with opacity-50 + cursor-not-allowed
    await page.goto("/admin/connections");
    const reviewCard = page.getByRole("article", { name: /Connection 2:/ });
    const reviewEditSpan = reviewCard
      .locator("span")
      .filter({ hasText: /^Edit$/ });
    await expect(reviewEditSpan).toBeVisible();
    await expect(reviewEditSpan).toHaveClass(/opacity-50/);
    await expect(reviewEditSpan).toHaveClass(/cursor-not-allowed/);

    // PUBLISHED card Edit is also a disabled <span>
    const publishedCard = page.getByRole("article", { name: /Connection 1:/ });
    const publishedEditSpan = publishedCard
      .locator("span")
      .filter({ hasText: /^Edit$/ });
    await expect(publishedEditSpan).toBeVisible();
    await expect(publishedEditSpan).toHaveClass(/opacity-50/);
    await expect(publishedEditSpan).toHaveClass(/cursor-not-allowed/);
  });

  test("2.4 Delete button is only enabled for DRAFT connections", async ({
    page,
  }) => {
    await page.goto("/admin/connections");
    await expect(
      page.getByRole("heading", { name: "Connections" }),
    ).toBeVisible();

    // DRAFT card (id=3) — DeleteButton renders a real <button> with bg-red-500, enabled
    const draftCard = page.getByRole("article", { name: /Connection 3:/ });
    const draftDeleteBtn = draftCard.getByRole("button", { name: "Delete" });
    await expect(draftDeleteBtn).toHaveClass(/bg-red-500/);
    await expect(draftDeleteBtn).not.toBeDisabled();

    // REVIEW card (id=2) — static disabled <button> with opacity-50
    const reviewCard = page.getByRole("article", { name: /Connection 2:/ });
    const reviewDeleteBtn = reviewCard.getByRole("button", { name: "Delete" });
    await expect(reviewDeleteBtn).toBeDisabled();

    // PUBLISHED card (id=1) — also disabled
    const publishedCard = page.getByRole("article", { name: /Connection 1:/ });
    const publishedDeleteBtn = publishedCard.getByRole("button", {
      name: "Delete",
    });
    await expect(publishedDeleteBtn).toBeDisabled();
  });

  test("2.5 Reviews button links to connection reviews when reviews exist", async ({
    page,
  }) => {
    await page.goto("/admin/connections");
    await expect(
      page.getByRole("heading", { name: "Connections" }),
    ).toBeVisible();

    // PUBLISHED card (id=1) Reviews button:
    //   reviews exist  → <Link> as <a> with text "Reviews (N)"
    //   no reviews     → <span> with opacity-50 and text "Reviews"
    const publishedCard = page.getByRole("article", { name: /Connection 1:/ });
    const reviewsLink = publishedCard.getByRole("link", {
      name: /^Reviews/,
    });
    const reviewsSpan = publishedCard
      .locator("span")
      .filter({ hasText: /^Reviews$/ });

    const hasReviews = await reviewsLink.isVisible();

    if (hasReviews) {
      await reviewsLink.click();
      await expect(page).toHaveURL(/\/admin\/connections\/\d+\/reviews/);
    } else {
      await expect(reviewsSpan).toBeVisible();
      await expect(reviewsSpan).toHaveClass(/opacity-50/);
      await expect(reviewsSpan).toHaveClass(/cursor-not-allowed/);
    }
  });

  // TODO: find out how to do this test or if it is needed.
  /*test("2.6 Empty state shows message and link when no connections exist", async ({
    page,
  }) => {
    // Navigate with DRAFT filter and delete the DRAFT connection (id=3)
    await page.goto("/admin/connections?state=DRAFT");
    await expect(
      page.getByRole("heading", { name: "Connections" }),
    ).toBeVisible();

    const draftCard = page.getByRole("article", { name: /Connection 3:/ });
    await expect(draftCard).toBeVisible();

    // Accept the window.confirm dialog before clicking Delete
    page.once("dialog", (dialog) => dialog.accept());
    await draftCard.getByRole("button", { name: "Delete" }).click();
    await expect(draftCard).not.toBeVisible();

    // Re-apply Draft filter to see the empty state
    await page.getByRole("button", { name: "Draft" }).click();
    await expect(page).toHaveURL(/state=DRAFT/);

    await expect(page.getByText("No connections yet.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Create one" }),
    ).toBeVisible();

    // 'Create one' link navigates to /admin/connections/new
    await page.getByRole("link", { name: "Create one" }).click();
    await expect(page).toHaveURL(/\/admin\/connections\/new/);
  }); */
});
