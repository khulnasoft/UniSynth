import { Show } from '@khulnasoft.com/unisynth';

export default function MyComponent(props: any) {
  return (
    <div>
      {props.name}
      <Show when={props.name === 'Batman'}>
        <MyComponent name={'Bruce Wayne'} />
      </Show>
    </div>
  );
}
