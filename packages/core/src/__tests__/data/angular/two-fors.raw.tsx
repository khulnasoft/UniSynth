import { For, useState } from '@khulnasoft.com/unisynth';

export default function MyComponent() {
  const [items] = useState([1, 2, 3]);

  return (
    <div>
      <For each={items}>{(item) => <div key={item}>{item}</div>}</For>
      <For each={items}>{(item) => <div key={item}>{item}</div>}</For>
    </div>
  );
}
