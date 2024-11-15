import { useState } from '@khulnasoft.com/unisynth';

export default function MyComponent(props) {
  const [refToUse] = useState(
    !(props.componentRef instanceof Function) ? props.componentRef : null,
  );

  return <div>{refToUse}</div>;
}
