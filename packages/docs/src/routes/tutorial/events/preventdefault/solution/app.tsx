import { component$ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  return (
    <a href="/" preventdefault:click onClick$={() => alert('do something else.')}>
      click me!
    </a>
  );
});
