import { component$ } from "@khulnasoft.com/unisynth";
import { Link } from "@khulnasoft.com/unisynth-city";

export default component$(() => (
  <div>
    <p>
      <Link id="link" href="/unisynthcity-test/issue4502/broken">
        Link
      </Link>
    </p>
    <p>
      <a id="anchor" href="/unisynthcity-test/issue4502/broken">
        Anchor
      </a>
    </p>
  </div>
));
