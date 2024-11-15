import { onUpdate } from '@khulnasoft.com/unisynth';

export default function OnUpdate() {
  onUpdate(() => {
    foo({
      someOption: bar,
    });
  });

  function foo(params) {}

  function bar() {}

  function zoo() {
    const params = {
      cb: bar,
    };
  }

  return <div />;
}
