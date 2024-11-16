import { Slot, component$, useSignal } from "@khulnasoft.com/unisynth";

export default component$(() => {
  const count = useSignal(0);
  return (
    <div>
      <button id="count" onClick$={() => count.value++}>
        Count: {count.value}
      </button>
      <Slot />
    </div>
  );
});
