import { component$ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  return (
    <main>
      <Greeter />
    </main>
  );
});

interface GreeterProps {}
export const Greeter = component$((props: GreeterProps) => {
  return <p>Bind props here</p>;
});
