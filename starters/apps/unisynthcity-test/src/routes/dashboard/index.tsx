import { component$ } from "@khulnasoft.com/unisynth";
import type { DocumentHead } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        <a href="/unisynthcity-test/sign-out/">Sign Out</a>
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Home",
};
