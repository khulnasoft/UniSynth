import { component$ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  return (
    <>
      <button onClick$={async () => alert('Hello World!')}>click me</button>
    </>
  );
});
