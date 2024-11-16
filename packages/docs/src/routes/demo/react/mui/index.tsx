import { component$, useSignal } from '@khulnasoft.com/unisynth';
import { Example } from './react';

export default component$(() => {
  console.log('Unisynth Render');
  const selected = useSignal(0);
  return (
    <Example
      selected={selected.value}
      onSelected$={(v) => (selected.value = v)}
    >
      Selected tab: {selected.value}
    </Example>
  );
});
