import { component$, useSignal } from "@khulnasoft.com/unisynth";

export const Counter = component$(() => {
  const count = useSignal(0);

  return (
    <div>
      <p>Count: {count.value}</p>
      <p>
        <button onClick$={() => count.value++}>Increment</button>
      </p>
    </div>
  );
});
