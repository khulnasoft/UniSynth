import { component$, Slot } from "@khulnasoft.com/unisynth";
import { Link } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  return (
    <div data-test-layout="blog">
      <section class="blog-content">
        <Slot />
      </section>
      <aside class="blog-menu">
        <ul>
          <li>
            <Link
              href="/unisynthcity-test/blog/what-is-resumability"
              data-test-link="blog-resumability"
            >
              What Is Resumability?
            </Link>
          </li>
          <li>
            <Link
              href="/unisynthcity-test/blog/serializing-props"
              data-test-link="blog-serializing-props"
            >
              Serializing Props
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
});
