import json5 from 'json5';
import { size } from 'lodash';
import { UnisynthNode } from '../types/unisynth-node';
import { UnisynthStyles } from '../types/unisynth-styles';
import { createSingleBinding } from './bindings';

export const getStyles = (json: UnisynthNode) => {
  if (!json.bindings.css) {
    return null;
  }
  let css: UnisynthStyles;
  try {
    css = json5.parse(json.bindings.css?.code);
  } catch (err) {
    console.warn('Could not json 5 parse css', err, json.bindings.css.code);
    return null;
  }
  return css;
};

export const setStyles = (json: UnisynthNode, styles: UnisynthStyles | null) => {
  if (!size(styles)) {
    delete json.bindings.css;
  } else {
    json.bindings.css = createSingleBinding({ code: json5.stringify(styles) });
  }
};
