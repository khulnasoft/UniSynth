import { component$, useSignal } from '@khulnasoft.com/unisynth';

export default component$(() => {
  const count = useSignal(0);

  return (
    <button onClick$={() => count.value++}>
      Increment {count.value}
    </button>
  );
});
