import traverse from 'neotraverse/legacy';
import { UnisynthComponent } from '../types/unisynth-component';
import { isUnisynthNode } from './is-unisynth-node';

export function getComponentsUsed(json: UnisynthComponent) {
  const components = new Set<string>();

  traverse(json).forEach(function (item) {
    if (isUnisynthNode(item)) {
      components.add(item.name);
    }
  });

  return components;
}
