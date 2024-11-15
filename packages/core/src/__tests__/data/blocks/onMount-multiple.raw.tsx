import { onMount } from '@khulnasoft.com/unisynth';

export default function Comp() {
  onMount(() => {
    console.log('Runs on mount');
  });

  onMount(() => {
    console.log('Another one runs on Mount');
  });

  onMount(
    () => {
      console.log('SSR runs on Mount');
    },
    { onSSR: true },
  );

  return <div />;
}
