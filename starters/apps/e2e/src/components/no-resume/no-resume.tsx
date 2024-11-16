import { component$ } from "@khulnasoft.com/unisynth";

export const NoResume = component$(() => {
  return (
    <button
      onClick$={() => {
        document.body.style.background = "black";
      }}
    >
      Click me
    </button>
  );
});
