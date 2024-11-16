import { component$, useStore } from '@khulnasoft.com/unisynth';

export default component$(() => {
  const state = useStore({ count: 0, name: 'Unisynth' });

  return (
    <>
      <button onClick$={() => state.count++}>Increment</button>
      <p>Count: {state.count}</p>
      <input
        value={state.name}
        onInput$={(_, el) => (state.name = el.value)}
      />
    </>
  );
});
