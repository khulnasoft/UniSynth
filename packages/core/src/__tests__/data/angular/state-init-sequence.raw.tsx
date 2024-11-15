import { useStore } from '@khulnasoft.com/unisynth';

export default function MyComponent(props) {
  const state = useStore({
    val: props.value,
  });
  return <Comp val={{ ...state.val }}>{state.val}</Comp>;
}
