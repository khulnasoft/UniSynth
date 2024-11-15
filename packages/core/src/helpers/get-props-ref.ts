import traverse from 'neotraverse/legacy';
import { UnisynthComponent } from '../types/unisynth-component';
import { isUnisynthNode } from './is-unisynth-node';

export function getPropsRef(json: UnisynthComponent, shouldRemove?: boolean): [string, boolean] {
  let has = false;
  let prop = '';
  traverse(json).forEach(function (item) {
    if (isUnisynthNode(item)) {
      const binding = item.bindings.ref;
      const regexp = /(.+)?props\.(.+)( |\)|;|\()?$/;
      if (binding && regexp.test(binding.code)) {
        const match = regexp.exec(binding.code);
        const _prop = match?.[2];
        if (_prop) {
          prop = _prop;
        }
        if (shouldRemove) {
          delete item.bindings.ref;
        }
        has = true;
        this.stop();
      }
    }
  });
  return [prop, has];
}
