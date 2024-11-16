/* eslint-disable no-console */
import { component$, useStore } from '@khulnasoft.com/unisynth';

export default component$(() => {
  const store = useStore({ count: 0 });
  return (
    <>
      Count: {store.count} <button onClick$={() => console.log('+1')}>+1</button>
    </>
  );
});
