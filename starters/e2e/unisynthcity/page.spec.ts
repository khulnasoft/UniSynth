import { expect, test } from "@playwright/test";
import { assertPage, linkNavigate, load, locator } from "./util.js";

test.describe("Unisynth City Page", () => {
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
  test("Unisynth City Page", async ({ context, javaScriptEnabled }) => {
    const ctx = await load(context, javaScriptEnabled, "/unisynthcity-test/");

    /***********  Home Page  ***********/
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/",
      title: "Welcome to Unisynth City - Unisynth",
      layoutHierarchy: ["root"],
      h1: "Welcome to Unisynth City",
      activeHeaderLink: false,
    });

    /***********  Blog: home  ***********/
    await linkNavigate(ctx, '[data-test-link="blog-home"]');
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/blog/",
      title: "Welcome to our Blog! - Unisynth",
      layoutHierarchy: ["root", "blog"],
      h1: "Welcome to our Blog!",
      activeHeaderLink: "Blog",
    });

    /***********  Blog: resumability  ***********/
    await linkNavigate(ctx, '[data-test-link="blog-resumability"]');
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/blog/what-is-resumability/",
      title: "Blog: what-is-resumability - Unisynth",
      layoutHierarchy: ["root", "blog"],
      h1: "Blog: what-is-resumability",
      activeHeaderLink: "Blog",
    });

    /***********  Blog: serializing-props  ***********/
    await linkNavigate(ctx, '[data-test-link="blog-serializing-props"]');
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/blog/serializing-props/",
      title: "Blog: serializing-props - Unisynth",
      layoutHierarchy: ["root", "blog"],
      h1: "Blog: serializing-props",
      activeHeaderLink: "Blog",
    });

    /***********  Docs: home  ***********/
    await linkNavigate(ctx, '[data-test-link="docs-home"]');
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/docs/",
      title: "Docs: Welcome! - Unisynth",
      layoutHierarchy: ["docs"],
      h1: "Welcome to the Docs!",
      activeHeaderLink: "Docs",
    });

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

    /***********  Products: hat  ***********/
    await linkNavigate(ctx, '[data-test-link="products-hat"]');
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/products/hat/",
      title: "Product hat - Unisynth",
      layoutHierarchy: ["root"],
      h1: "Product: hat",
      activeHeaderLink: "Products",
    });

    /***********  Products: jacket  ***********/
    await linkNavigate(ctx, '[data-test-link="products-jacket"]');
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/products/jacket/",
      title: "Product jacket - Unisynth",
      layoutHierarchy: ["root"],
      h1: "Product: jacket",
      activeHeaderLink: "Products",
    });

    if (!javaScriptEnabled) {
      /***********  Products: shirt (301 redirect to /products/tshirt)  ***********/
      await linkNavigate(ctx, '[data-test-link="products-shirt"]');
      await assertPage(ctx, {
        pathname: "/unisynthcity-test/products/tshirt/",
        title: "Product tshirt - Unisynth",
        layoutHierarchy: ["root"],
        h1: "Product: tshirt",
        activeHeaderLink: "Products",
      });
    }

    /***********  Products: hoodie (404)  ***********/
    await linkNavigate(ctx, '[data-test-link="products-hoodie"]', 404);
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/products/hoodie/",
      title: "Product hoodie - Unisynth",
      layoutHierarchy: ["root"],
      h1: "Product: hoodie",
      activeHeaderLink: "Products",
    });

    /***********  About Us  ***********/
    await linkNavigate(ctx, '[data-test-link="about-us"]');
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/about-us/",
      title: "About Us - Unisynth",
      layoutHierarchy: ["root"],
      h1: "About Us",
      activeHeaderLink: "About Us",
    });

    /***********  API: home  ***********/
    await linkNavigate(ctx, '[data-test-link="api-home"]');
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/api/",
      title: "API: /unisynthcity-test/api/ - Unisynth",
      layoutHierarchy: ["api"],
      h1: "Unisynth City Test API!",
      activeHeaderLink: "API",
    });

    const nodeVersion = locator(ctx, "[data-test-api-node]");
    if (javaScriptEnabled) {
      // TODO!!
    } else {
      // no useBrowserVisibleTask()
      expect(await nodeVersion.innerText()).toBe("");
    }

    /***********  MIT  ***********/
    await linkNavigate(ctx, '[data-test-link="mit"]');
    await assertPage(ctx, {
      pathname: "/unisynthcity-test/mit/",
      title: "MIT License - Unisynth",
      layoutHierarchy: [],
      h1: "MIT License",
    });
  });
}
