import { component$, useSignal } from '@khulnasoft.com/unisynth';

export default component$(() => {
  const count = useSignal(0);

  return (
    <>
      <p>Count: {count.value}</p>
      <button onClick$={() => count.value++}>Increment</button>
    </>
  );
});
