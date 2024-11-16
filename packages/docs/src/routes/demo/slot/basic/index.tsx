import { Slot, component$ } from '@khulnasoft.com/unisynth';

const Button = component$(() => {
  return (
    <button>
      Content: <Slot />
    </button>
  );
});

export default component$(() => {
  return (
    <Button>
      This goes inside {'<Button>'} component marked by{`<Slot>`}
    </Button>
  );
});
