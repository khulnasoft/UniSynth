/** @jsxImportSource react */
import { unisynthify$ } from '@khulnasoft.com/unisynth-react';
import { type ReactNode } from 'react';

function Button({ children }: { children?: ReactNode[] }) {
  console.log('React <Button/> Render');
  return <button>{children}</button>;
}

function Display({ count }: { count: number }) {
  console.log('React <Display count=' + count + '/> Render');
  return <div className="react">Count: {count}</div>;
}

export const QButton = unisynthify$(Button);
export const QDisplay = unisynthify$(Display);
