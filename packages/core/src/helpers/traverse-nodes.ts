import traverse, { type TraverseContext } from 'neotraverse/legacy';
import { UnisynthComponent } from '../types/unisynth-component';
import { UnisynthNode } from '../types/unisynth-node';
import { isUnisynthNode } from './is-unisynth-node';

export function traverseNodes(
  component: UnisynthComponent | UnisynthNode,
  cb: (node: UnisynthNode, context: TraverseContext) => void,
) {
  traverse(component).forEach(function (item) {
    if (isUnisynthNode(item)) {
      cb(item, this);
    }
  });
}
