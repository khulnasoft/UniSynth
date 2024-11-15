import { For, Fragment } from '@khulnasoft.com/unisynth';

export default function BasicForFragment() {
  return (
    <div>
      <For each={['a', 'b', 'c']}>
        {(option) => (
          <Fragment key={`key-${option}`}>
            <div>{option}</div>
          </Fragment>
        )}
      </For>
    </div>
  );
}
