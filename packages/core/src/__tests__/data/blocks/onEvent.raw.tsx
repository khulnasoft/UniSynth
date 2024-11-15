import { onEvent, onMount, useRef, useStore } from '@khulnasoft.com/unisynth';

export default function Embed() {
  const elem = useRef<HTMLDivElement>(null);

  const state = useStore({
    foo(event) {
      console.log('test2');
    },
  });

  onEvent(
    'initEditingBldr',
    (event) => {
      console.log('test');
      state.foo(event);
    },
    elem,
    true,
  );

  onMount(() => {
    elem.dispatchEvent(new CustomEvent('initEditingBldr'));
  });

  return (
    <div ref={elem} class="khulnasoft-embed">
      <div>Test</div>
    </div>
  );
}
