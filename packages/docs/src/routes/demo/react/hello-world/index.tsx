import { component$ } from '@khulnasoft.com/unisynth';
import { QGreetings } from './react';

export default component$(() => {
  return (
    <main>
      <p>Hello from Unisynth</p>
      <QGreetings />
    </main>
  );
});
