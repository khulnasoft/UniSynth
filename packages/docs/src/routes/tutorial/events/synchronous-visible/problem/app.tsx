import { component$ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  return (
    <a href="/" onClick$={() => window.open('http://unisynth.dev')}>
      click me!
    </a>
  );
});
