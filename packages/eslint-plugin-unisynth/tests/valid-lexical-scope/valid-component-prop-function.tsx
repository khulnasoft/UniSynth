import { component$, type QRL } from '@khulnasoft.com/unisynth';

export default component$<{ onClick$: QRL<() => void> }>(({ onClick$ }) => {
  return (
    <button
      onClick$={() => {
        onClick$();
      }}
    />
  );
});
