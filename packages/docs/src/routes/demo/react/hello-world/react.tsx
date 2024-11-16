/** @jsxImportSource react */
import { unisynthify$ } from '@khulnasoft.com/unisynth-react';

// Create React component standard way
function Greetings() {
  return <p>Hello from React</p>;
}

// Convert React component to Unisynth component
export const QGreetings = unisynthify$(Greetings);
