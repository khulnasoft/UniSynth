import { parseChildren } from '../helpers/children';
import { createUnisynthNode } from '../helpers/unisynth-node';

import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import type { SveltosisComponent } from '../types';

export function parseFragment(json: SveltosisComponent, node: TemplateNode) {
  let unisynthNode = createUnisynthNode();

  unisynthNode.name = 'Fragment';
  unisynthNode.children = parseChildren(json, node);

  // if there is only one child, don't even bother to render the fragment as it is not necessary
  if (unisynthNode.children.length === 1) {
    unisynthNode = unisynthNode.children[0];
  }
  return unisynthNode;
}
