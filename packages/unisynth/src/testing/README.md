### @khulnasoft.com/unisynth/testing

```ts
//vite.config.ts
import { defineConfig } from 'vite';
import { unisynthVite } from '@khulnasoft.com/unisynth/optimizer';
import { unisynthCity } from '@khulnasoft.com/unisynth-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    plugins: [unisynthCity(), unisynthVite(), tsconfigPaths()],
    define: {
      'globalThis.qTest': true,
      'globalThis.qDev': true,
    },
  };
});
```

```jsx
// card.test.tsx

import { createDOM } from '@khulnasoft.com/unisynth/testing';
import { test, expect } from 'vitest';
import Card from './card.tsx';

test(`[Card Component]: 🙌 Only render`, async () => {
  const { screen, render } = await await createDOM();
  await render(<Card />);
  expect(screen.outerHTML).toContain('Counter_0');
});

test(`[Card Component]: 🙌 Click counter +1 `, async () => {
  const { screen, render, userEvent } = await await createDOM();
  await render(<Card />);
  expect(screen.outerHTML).toContain('Counter_0');
  await userEvent('button.btn-counter', 'click');
  expect(screen.outerHTML).toContain('Counter_1');
});
```
