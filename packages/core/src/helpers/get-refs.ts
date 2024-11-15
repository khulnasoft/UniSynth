import traverse from 'neotraverse/legacy';
import { UnisynthComponent } from '../types/unisynth-component';
import { isUnisynthNode } from './is-unisynth-node';

export const getRefs = (json: UnisynthComponent, refKey: string = 'ref') => {
  const refs = new Set<string>();
  traverse(json).forEach(function (item) {
    if (isUnisynthNode(item)) {
      const binding = item.bindings[refKey];
      if (binding && typeof binding.code === 'string') {
        refs.add(binding.code);
      }
    }
  });

  return refs;
};
