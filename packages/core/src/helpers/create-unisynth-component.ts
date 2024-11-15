import { UnisynthComponent } from '../types/unisynth-component';
import { Overwrite, Prettify } from './typescript';

type PartialUnisynthComponent = Prettify<
  Overwrite<
    Partial<UnisynthComponent>,
    {
      hooks: Partial<UnisynthComponent['hooks']>;
    }
  >
>;

export const createUnisynthComponent = (options?: PartialUnisynthComponent): UnisynthComponent => {
  const { name, hooks, ...remainingOpts } = options || {};
  const { onEvent = [], onMount = [], ...remainingHooks } = hooks || {};
  return {
    '@type': '@khulnasoft.com/unisynth/component',
    imports: [],
    exports: {},
    inputs: [],
    meta: {},
    refs: {},
    state: {},
    children: [],
    context: { get: {}, set: {} },
    subComponents: [],
    name: name || 'MyComponent',
    hooks: {
      onMount,
      onEvent,
      ...remainingHooks,
    },
    ...remainingOpts,
  };
};
