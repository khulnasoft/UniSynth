import { UnisynthComponent } from '../types/unisynth-component';
import { UnisynthNode } from '../types/unisynth-node';

export function isRootTextNode(json: UnisynthComponent | UnisynthNode) {
  const firstChild = json.children[0];
  return Boolean(json.children.length === 1 && firstChild && isTextNode(firstChild));
}

export function isTextNode(node: UnisynthNode) {
  return Boolean(node.properties._text || node.bindings._text);
}
