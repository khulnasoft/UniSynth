import { test, expect } from "@playwright/test";

test("rendered", async ({ page }) => {
  await page.goto("/starter-partytown-test/");
  page.on("pageerror", (err) => expect(err).toEqual(undefined));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      expect(msg.text()).toEqual(undefined);
    }
  });

  const congrats = page.locator(".congrats");
  const state = page.locator("#state");
  await expect(congrats).toContainText(
    "Congratulations Unisynth with Partytown is working!",
  );
  await expect(state).toHaveText("running");

  await expect(state).toHaveText("finished");
});

test("update text", async ({ page }) => {
  await page.goto("/starter-partytown-test/");
  page.on("pageerror", (err) => expect(err).toEqual(undefined));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      expect(msg.text()).toEqual(undefined);
    }
  });

  await page.fill("input", "UNISYNTH");
  await page.dispatchEvent("input", "keyup");
  await expect(page.locator("ol")).toContainText("Hello UNISYNTH!");
});
