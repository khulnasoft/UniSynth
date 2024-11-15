import { onInit } from '@khulnasoft.com/unisynth';

export default function OnInitPlain() {
  onInit(() => {
    console.log('onInit');
  });

  return <div />;
}
