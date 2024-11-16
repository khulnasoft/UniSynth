import { component$ } from "@khulnasoft.com/unisynth";
import type { DocumentHead } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  return (
    <div>
      <h1>Profile</h1>
      <p>My Profile</p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Profile",
};
