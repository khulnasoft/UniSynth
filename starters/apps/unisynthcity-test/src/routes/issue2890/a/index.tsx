import { component$ } from "@khulnasoft.com/unisynth";
import { Link } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  return (
    <div>
      <div>
        <Link id="issue2890-link-0" href="/unisynthcity-test/issue2890/b/">
          /b/
        </Link>
      </div>
      <div>
        <Link
          id="issue2890-link-1"
          href="/unisynthcity-test/issue2890/b/?query=123"
        >
          /b/?query=123
        </Link>
      </div>
      <div>
        <Link
          id="issue2890-link-2"
          href="/unisynthcity-test/issue2890/b?query=321"
        >
          /b?query=321
        </Link>
      </div>
      <div>
        <Link
          id="issue2890-link-3"
          href="/unisynthcity-test/issue2890/b/?query=321&hash=true#h2"
        >
          /b/?query=321&hash=true#h2
        </Link>
      </div>
      <div>
        <Link
          id="issue2890-link-4"
          href="/unisynthcity-test/issue2890/b?query=321&hash=true#h2"
        >
          /b?query=321&hash=true#h2
        </Link>
      </div>
    </div>
  );
});
