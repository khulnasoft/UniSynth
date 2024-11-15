import { onMount, useMetadata, useStore } from '@khulnasoft.com/unisynth';

useMetadata({
  outputs: ['onMessage', 'onEvent'],
});
export default function MyBasicOutputsComponent(props: any) {
  useMetadata({
    baz: 'metadata inside component',
  });

  const state = useStore({
    name: 'PatrickJS',
  });

  onMount(() => {
    props.onMessage(state.name);
    props.onEvent(props.message);
  });

  return <div></div>;
}
