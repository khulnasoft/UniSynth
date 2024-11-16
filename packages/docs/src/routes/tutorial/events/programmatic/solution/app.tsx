import { component$, useOn, $ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  useOn(
    'click',
    $(() => alert('Hello World!'))
  );

  return <p>App Component. Click me.</p>;
});
