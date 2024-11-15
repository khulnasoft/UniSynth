import { UnisynthNode } from '../../../types/unisynth-node';

export function createUnisynthNode(): UnisynthNode {
  return {
    '@type': '@khulnasoft.com/unisynth/node',
    name: '',
    meta: {},
    scope: {},
    children: [],
    bindings: {},
    properties: {},
    slots: {},
  };
}
