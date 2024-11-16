import { component$, useTask$, JSXOutput, useStore } from '@khulnasoft.com/unisynth';

type FooState = {
  foo?: JSXOutput;
};

export default component$(() => {
  const state = useStore<FooState>({});
  state.foo = <div>Foo</div>;

  useTask$(() => {
    // eslint-disable-next-line no-console
    console.log(state.foo);
  });
  return <></>;
});
