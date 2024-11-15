import { useState } from '@khulnasoft.com/unisynth';

export default function MyComponent(props) {
  const [obj, setObj] = useState({
    name: 'foo',
    Component: FooComponent,
  });

  function onClick() {
    console.log('hello');
  }

  return (
    <obj.Component
      hello="world"
      onClick={() => onClick()}
      {...props.attributes}
      {...props.something}
    >
      hello
      {props.children}
    </obj.Component>
  );
}
