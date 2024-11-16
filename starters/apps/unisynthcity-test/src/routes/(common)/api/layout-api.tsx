import { component$, Slot, useStyles$ } from "@khulnasoft.com/unisynth";
import type { DocumentHead } from "@khulnasoft.com/unisynth-city";
import styles from "./layout-api.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <div data-test-layout="api" class="api">
      <aside class="api-menu">
        <h2>API</h2>
        <ul>
          <li>
            <a
              href="/unisynthcity-test/api/builder.io/oss.json"
              data-test-link="api-org-user"
            >
              Org/User
            </a>
          </li>
          <li>
            <a
              href="/unisynthcity-test/api/data.json"
              data-test-link="api-data"
            >
              Data
            </a>
          </li>
        </ul>
      </aside>
      <section class="api-content">
        <Slot />
      </section>
    </div>
  );
});

export const head: DocumentHead = ({ url }) => {
  return {
    title: `API: ${url.pathname}`,
  };
};
