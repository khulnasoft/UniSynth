import traverse from 'neotraverse/legacy';
import { isUnisynthNode } from '../../../helpers/is-unisynth-node';
import { UnisynthComponent } from '../../../types/unisynth-component';

/**
 * Find event handlers that explicitly call .preventDefault() and
 * add preventdefault:event
 * https://qwik.khulnasoft.com/tutorial/events/preventdefault
 */
export function addPreventDefault(json: UnisynthComponent) {
  traverse(json).forEach((node) => {
    if (isUnisynthNode(node)) {
      if (node.bindings) {
        for (const key of Object.keys(node.bindings)) {
          if (key.startsWith('on')) {
            if (node.bindings[key]?.code.includes('.preventDefault()')) {
              const event = key.slice(2).toLowerCase();
              node.properties['preventdefault:' + event] = '';
              node.bindings[key]!.code = node.bindings[key]!.code.replace(
                /.*?\.preventDefault\(\);?/,
                '',
              ).trim();
            }
          }
        }
      }
    }
  });
}
