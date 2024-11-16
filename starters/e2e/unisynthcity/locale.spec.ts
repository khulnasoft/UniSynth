import { expect, test } from "@playwright/test";

test.describe("Unisynth City locale API", () => {
  test("pass locale to Unisynth", async ({ page }) => {
    await page.goto("/unisynthcity-test/locale");
    const locale = page.locator(".locale");
    const qContainer = page.locator("[q\\:container]");
    await expect(locale).toHaveText("test-locale");
    await expect(qContainer).toHaveAttribute("q:locale", "test-locale");
  });
});
