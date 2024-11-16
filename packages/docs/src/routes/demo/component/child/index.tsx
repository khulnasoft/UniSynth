import { component$ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  return (
    <>
      <p>Parent Text</p>
      <Child />
    </>
  );
});

const Child = component$(() => {
  return <p>Child Text</p>;
});
