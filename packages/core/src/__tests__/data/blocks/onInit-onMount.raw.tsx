import { onInit, onMount } from '@khulnasoft.com/unisynth';

export default function OnInit() {
  onInit(() => {
    console.log('onInit');
  });

  onMount(() => {
    console.log('onMount');
  });

  return <div />;
}
