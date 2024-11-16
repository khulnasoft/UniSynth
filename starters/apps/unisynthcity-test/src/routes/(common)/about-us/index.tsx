import { component$ } from "@khulnasoft.com/unisynth";
import type { DocumentHead } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  return (
    <div>
      <h1>About Us</h1>
      <p>
        <a href="/unisynthcity-test/">Home</a>
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "About Us",
};
