import { component$ } from '@khulnasoft.com/unisynth';
import { QCounter } from './react';

export default component$(() => {
  console.log('Unisynth Render');
  return (
    <main>
      <QCounter />
    </main>
  );
});
