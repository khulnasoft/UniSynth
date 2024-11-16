import { expect, test } from "@playwright/test";
import { assertPage, linkNavigate, load, locator } from "./util.js";

test.describe("Unisynth City Menu", () => {
  test.describe("mpa", () => {
    test.use({ javaScriptEnabled: false });
    tests();
  });
  test.describe("spa", () => {
    test.use({ javaScriptEnabled: true });
    tests();
  });
});

function tests() {
  test("Unisynth City Menu", async ({ context, javaScriptEnabled }) => {
    const ctx = await load(context, javaScriptEnabled, "/unisynthcity-test/");

    /***********  Docs: home  ***********/
    await linkNavigate(ctx, '[data-test-link="docs-home"]');
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/docs/",
      title: "Docs: Welcome! - Unisynth",
      layoutHierarchy: ["docs"],
      h1: "Welcome to the Docs!",
      activeHeaderLink: "Docs",
    });

    let menuHeader = locator(ctx, `[data-test-menu-header="0"]`);
    expect(await menuHeader.innerText()).toBe("Introduction");

    let breadcrumb0 = locator(ctx, `[data-test-breadcrumb="0"]`);
    if (await breadcrumb0.isVisible()) {
      expect(true, `Breadcrumb selector ${breadcrumb0} found`).toBe(false);
    }

    /***********  Docs: overview  ***********/
    await linkNavigate(
      ctx,
      '[data-test-menu-link="/unisynthcity-test/docs/overview/"]',
    );
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/docs/overview/",
      title: "Docs: Overview - Unisynth",
      layoutHierarchy: ["docs"],
      h1: "Overview",
      activeHeaderLink: "Docs",
    });

    menuHeader = locator(ctx, `[data-test-menu-header="0"]`);
    expect(await menuHeader.innerText()).toBe("Introduction");

    breadcrumb0 = locator(ctx, `[data-test-breadcrumb="0"]`);
    expect(await breadcrumb0.innerText()).toBe("Introduction");

    let breadcrumb1 = locator(ctx, `[data-test-breadcrumb="1"]`);
    expect(await breadcrumb1.innerText()).toBe("Overview");

    /***********  Docs: getting-started  ***********/
    await linkNavigate(
      ctx,
      '[data-test-menu-link="/unisynthcity-test/docs/getting-started/"]',
    );
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/docs/getting-started/",
      title: "Docs: @khulnasoft.com/unisynth Getting Started - Unisynth",
      layoutHierarchy: ["docs"],
      h1: "Getting Started",
      activeHeaderLink: "Docs",
    });

    menuHeader = locator(ctx, `[data-test-menu-header="0"]`);
    expect(await menuHeader.innerText()).toBe("Introduction");

    breadcrumb0 = locator(ctx, `[data-test-breadcrumb="0"]`);
    expect(await breadcrumb0.innerText()).toBe("Introduction");

    breadcrumb1 = locator(ctx, `[data-test-breadcrumb="1"]`);
    expect(await breadcrumb1.innerText()).toBe("Getting Started");

    /***********  Docs: components/basics  ***********/
    await linkNavigate(
      ctx,
      '[data-test-menu-link="/unisynthcity-test/docs/components/basics/"]',
    );
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/docs/components/basics/",
      title: "Docs: components basics - Unisynth",
      layoutHierarchy: ["docs"],
      h1: "Docs: components basics",
      activeHeaderLink: "Docs",
    });

    menuHeader = locator(ctx, `[data-test-menu-header="0"]`);
    expect(await menuHeader.innerText()).toBe("Introduction");

    breadcrumb0 = locator(ctx, `[data-test-breadcrumb="0"]`);
    expect(await breadcrumb0.innerText()).toBe("Components");

    breadcrumb1 = locator(ctx, `[data-test-breadcrumb="1"]`);
    expect(await breadcrumb1.innerText()).toBe("Basics");

    /***********  Docs: components/listeners  ***********/
    await linkNavigate(
      ctx,
      '[data-test-menu-link="/unisynthcity-test/docs/components/listeners/"]',
    );
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/docs/components/listeners/",
      title: "Docs: components listeners - Unisynth",
      layoutHierarchy: ["docs"],
      h1: "Docs: components listeners",
      activeHeaderLink: "Docs",
    });

    menuHeader = locator(ctx, `[data-test-menu-header="0"]`);
    expect(await menuHeader.innerText()).toBe("Introduction");

    breadcrumb0 = locator(ctx, `[data-test-breadcrumb="0"]`);
    expect(await breadcrumb0.innerText()).toBe("Components");

    breadcrumb1 = locator(ctx, `[data-test-breadcrumb="1"]`);
    expect(await breadcrumb1.innerText()).toBe("Listeners");
  });
}
