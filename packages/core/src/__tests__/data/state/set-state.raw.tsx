import { useState, useStore } from '@khulnasoft.com/unisynth';

export default function SetState() {
  const [n] = useState(['123'], { reactive: true });

  const state = useStore({
    someFn() {
      n.value[0] = '123';
    },
  });

  return (
    <div>
      <button onClick={() => state.someFn()}>Click me</button>
    </div>
  );
}
