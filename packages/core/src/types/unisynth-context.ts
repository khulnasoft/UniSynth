import { ContextOptions, UnisynthState } from './unisynth-component';

export type UnisynthContext = ContextOptions & {
  '@type': '@khulnasoft.com/unisynth/context';
  name: string;
  value: UnisynthState;
};
