import { useStore } from '@khulnasoft.com/unisynth';

export default function MyComponent() {
  const state = useStore({
    errors: {},
    foo(errors) {
      return errors;
    },
  });

  return <>{state.foo(state.errors)}</>;
}
