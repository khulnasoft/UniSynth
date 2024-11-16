import { component$, sync$, $ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  return (
    <a
      href="/"
      onClick$={[
        sync$((event: MouseEvent): void => {
          if (event.ctrlKey) {
            event.preventDefault();
          }
        }),
        $(() => {
          console.log('clicked');
        }),
      ]}
    >
      click me!
    </a>
  );
});
