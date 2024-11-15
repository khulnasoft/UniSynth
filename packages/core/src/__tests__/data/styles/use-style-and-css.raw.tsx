import { useStyle } from '@khulnasoft.com/unisynth';

export default function MyComponent(props) {
  useStyle(`
        button {
            font-size: 12px;
            outline: 1px solid black;
        }
    `);

  return (
    <button
      css={{
        background: 'blue',
        color: 'white',
      }}
      type="button"
    >
      Button
    </button>
  );
}
