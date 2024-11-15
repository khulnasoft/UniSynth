import { useState } from '@khulnasoft.com/unisynth';

export default function MyBasicComponent(props: any) {
  const [attrs, setAttrs] = useState({ hello: 'world' });

  return <input {...attrs} {...props}></input>;
}
