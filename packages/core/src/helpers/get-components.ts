import traverse from 'neotraverse/legacy';
import { UnisynthComponent } from '../types/unisynth-component';
import { isUnisynthNode } from './is-unisynth-node';
import { isUpperCase } from './is-upper-case';

export function getComponents(json: UnisynthComponent): Set<string> {
  const components = new Set<string>();
  traverse(json).forEach(function (item) {
    if (isUnisynthNode(item)) {
      if (isUpperCase(item.name[0])) {
        components.add(item.name);
      }
    }
  });

  return components;
}
