import { onMount, onUnMount } from '@khulnasoft.com/unisynth';

export default function Comp() {
  onMount(() => {
    console.log('Runs on mount');
  });

  onUnMount(() => {
    console.log('Runs on unMount');
  });

  return <div />;
}
