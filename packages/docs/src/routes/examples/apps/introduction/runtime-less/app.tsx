import { component$ } from '@khulnasoft.com/unisynth';

export default component$(() => {
  console.log('render <App>');
  return (
    <article id="container">
      <button
        onClick$={() => {
          // The click handler is completely stateless, and does not use any UNISYNTH api.
          // Meaning, the unisynth runtime is NEVER downloaded, nor executed
          console.log('click');
          const div = document.querySelector('#container')! as HTMLElement;
          if (div.style.background === 'yellow') {
            div.style.background = 'red';
          } else {
            div.style.background = 'yellow';
          }
        }}
      >
        Action
      </button>
    </article>
  );
});
