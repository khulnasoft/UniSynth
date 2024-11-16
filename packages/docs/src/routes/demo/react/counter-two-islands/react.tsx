/** @jsxImportSource react */
import { unisynthify$ } from '@khulnasoft.com/unisynth-react';

function Button({ onClick }: { onClick: () => void }) {
  console.log('React <Button/> Render');
  return <button onClick={onClick}>+1</button>;
}

function Display({ count }: { count: number }) {
  console.log('React <Display count=' + count + '/> Render');
  return <p className="react">Count: {count}</p>;
}

export const QButton = unisynthify$(Button, { eagerness: 'hover' });
export const QDisplay = unisynthify$(Display);
