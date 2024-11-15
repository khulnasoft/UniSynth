import { useState, useStore } from '@khulnasoft.com/unisynth';

export default function MyComponent() {
  const [foo, _] = useState(false);
  const state = useStore({
    bar() {
      return foo;
    },
  });

  return <>{state.bar()}</>;
}
