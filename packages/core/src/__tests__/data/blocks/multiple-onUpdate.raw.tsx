import { onUpdate } from '@khulnasoft.com/unisynth';

export default function MultipleOnUpdate() {
  onUpdate(() => {
    console.log('Runs on every update/rerender');
  });

  onUpdate(() => {
    console.log('Runs on every update/rerender as well');
  });

  return <div />;
}
