/** @jsxImportSource react */
import { unisynthify$ } from '@khulnasoft.com/unisynth-react';
import { useState } from 'react';

// Create React component standard way
function Counter() {
  // Print to console to show when the component is rendered.
  console.log('React <Counter/> Render');
  const [count, setCount] = useState(0);
  return (
    <button className="react" onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

// Specify eagerness to hydrate component on hover event.
export const QCounter = unisynthify$(Counter, { eagerness: 'hover' });
