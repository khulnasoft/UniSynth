import { useState } from '@khulnasoft.com/unisynth';

export default function MyBasicComponent() {
  const [classState, setClassState] = useState('testClassName');

  return <div class={classState}>Hello! I can run in React, Vue, Solid, or Liquid!</div>;
}
