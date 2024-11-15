import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import { createUnisynthNode } from '../helpers/unisynth-node';

export function parseText(node: TemplateNode) {
  return {
    ...createUnisynthNode(),
    name: 'div',
    properties: {
      _text: node.data,
    },
  };
}
