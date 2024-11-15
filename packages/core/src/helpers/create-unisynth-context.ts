import { UnisynthContext } from '../types/unisynth-context';

export function createUnisynthContext(
  options: Partial<UnisynthContext> & { name: string },
): UnisynthContext {
  return {
    '@type': '@khulnasoft.com/unisynth/context',
    value: {},
    ...options,
  };
}
