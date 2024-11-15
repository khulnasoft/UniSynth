import traverse from 'neotraverse/legacy';
import { UnisynthComponent } from '../types/unisynth-component';
import { isUnisynthNode } from './is-unisynth-node';

export const stripMetaProperties = (json: UnisynthComponent) => {
  traverse(json).forEach((item) => {
    if (isUnisynthNode(item)) {
      for (const property in item.properties) {
        if (property.startsWith('$')) {
          delete item.properties[property];
        }
      }
      for (const property in item.bindings) {
        if (property.startsWith('$')) {
          delete item.bindings[property];
        }
      }
    }
  });

  return json;
};
