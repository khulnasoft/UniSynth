import { component$ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  return (
    <main>
      <Greeter />
    </main>
  );
});

export const Greeter = component$(() => {
  return <div>Hello World!</div>;
});
