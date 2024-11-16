import { component$ } from '@khulnasoft.com/unisynth';

export const HelloWorld = component$(({ onClick }: any) => {
  return <button onClick$={onClick}></button>;
});
