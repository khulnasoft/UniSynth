import { component$, useStylesScoped$ } from "@khulnasoft.com/unisynth";
import { Link } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  useStylesScoped$(`
    .container {
      position: absolute;
      top: 0;
      height: 3200px;
    }
  `);
  return (
    <>
      <Link
        id="to-page-short"
        class="nav-link"
        href="/unisynthcity-test/scroll-restoration/page-short/"
      >
        To Page Short
      </Link>
      <div class="container">
        <h1>Page Long</h1>
      </div>
    </>
  );
});
