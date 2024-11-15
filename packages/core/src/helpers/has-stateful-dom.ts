import traverse from 'neotraverse/legacy';
import { UnisynthComponent } from '../types/unisynth-component';
import { isUnisynthNode } from './is-unisynth-node';

export const hasStatefulDom = (json: UnisynthComponent) => {
  let has = false;
  traverse(json).forEach(function (item) {
    if (isUnisynthNode(item)) {
      if (/input|textarea|select/.test(item.name)) {
        has = true;
        this.stop();
      }
    }
  });
  return has;
};
