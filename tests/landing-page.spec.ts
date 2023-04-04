import { expect, test } from "@playwright/test";

test.describe("Landing page", () => {
  test("has title", async ({ page }) => {
    await page.goto("/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Work journal/);
  });

  test("has welcome text", async ({ page }) => {
    await page.goto("/");

    await expect(await page.getByText("Welcome to ")).toBeVisible();
  });
});
