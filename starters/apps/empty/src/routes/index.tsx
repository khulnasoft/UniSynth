import { component$ } from "@khulnasoft.com/unisynth";
import type { DocumentHead } from "@khulnasoft.com/unisynth-city";

export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
      <div>
        Can't wait to see what you build with unisynth!
        <br />
        Happy coding.
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Unisynth",
  meta: [
    {
      name: "description",
      content: "Unisynth site description",
    },
  ],
};
