import { component$ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  return <button onClick$={() => alert('Hello World!')}>Click Me</button>;
});
