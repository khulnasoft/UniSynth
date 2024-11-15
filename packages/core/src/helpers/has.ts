import traverse from 'neotraverse/legacy';
import { UnisynthComponent } from '../types/unisynth-component';
import { UnisynthNode } from '../types/unisynth-node';
import { isUnisynthNode } from './is-unisynth-node';

/**
 * Test if the component has something
 *
 * e.g.
 *    const hasSpread = has(component, node => some(node.bindings, { type: 'spread' }));
 */
export function has(json: UnisynthComponent, test: (node: UnisynthNode) => boolean) {
  let found = false;
  traverse(json).forEach(function (thing) {
    if (isUnisynthNode(thing)) {
      if (test(thing)) {
        found = true;
        this.stop();
      }
    }
  });
  return found;
}
