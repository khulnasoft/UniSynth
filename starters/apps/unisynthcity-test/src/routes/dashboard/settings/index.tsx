import { component$ } from "@khulnasoft.com/unisynth";
import type { DocumentHead } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  return (
    <div>
      <h1>Settings</h1>
      <p>My Settings</p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Settings",
};
