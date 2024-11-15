import { UnisynthNode } from '../types/unisynth-node';

export const createUnisynthNode = (options: Partial<UnisynthNode>): UnisynthNode => ({
  '@type': '@khulnasoft.com/unisynth/node',
  name: 'div',
  meta: {},
  scope: {},
  properties: {},
  bindings: {},
  children: [],
  ...options,
});
