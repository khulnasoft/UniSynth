import traverse from 'neotraverse/legacy';
import { UnisynthComponent } from '../types/unisynth-component';
import { isUnisynthNode } from './is-unisynth-node';

export const hasComponent = (name: string, json: UnisynthComponent) => {
  let has = false;
  traverse(json).forEach(function (item) {
    if (isUnisynthNode(item)) {
      if (item.name === name) {
        has = true;
        this.stop();
      }
    }
  });
  return has;
};
