import { onUpdate } from '@khulnasoft.com/unisynth';

export default function OnUpdate() {
  onUpdate(() => {
    console.log('Runs on every update/rerender');
  });

  return <div />;
}
