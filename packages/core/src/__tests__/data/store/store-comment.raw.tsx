import { useStore } from '@khulnasoft.com/unisynth';

export default function StringLiteralStore() {
  const state = useStore({
    foo: true, // Comment
    bar() {},
  });

  return <>{state.foo}</>;
}
