import traverse from 'neotraverse/legacy';
import { UnisynthComponent } from '../types/unisynth-component';
import isChildren from './is-children';
import { isUnisynthNode } from './is-unisynth-node';

export const hasBindingsText = (json: UnisynthComponent) => {
  let has = false;
  traverse(json).forEach(function (node) {
    if (isUnisynthNode(node) && !isChildren({ node }) && node.bindings._text?.code) {
      has = true;
      this.stop();
    }
  });
  return has;
};
