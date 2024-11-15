import { generate } from 'astring';

import { parseHtmlNode } from '.';
import { parseChildren } from '../helpers/children';
import { createUnisynthNode } from '../helpers/unisynth-node';

import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import { createSingleBinding } from '../../../helpers/bindings';
import type { SveltosisComponent } from '../types';

export function parseIfElse(json: SveltosisComponent, node: TemplateNode) {
  const unisynthNode = createUnisynthNode();
  unisynthNode.name = 'Show';
  unisynthNode.bindings = {
    when: createSingleBinding({
      code: generate(node.expression),
    }),
  };

  unisynthNode.children = parseChildren(json, node);

  if (node.else) {
    unisynthNode.meta.else =
      node.else.children?.length === 1
        ? parseHtmlNode(json, node.else.children[0])
        : {
            ...createUnisynthNode(),
            name: 'div',
            children: node.else.children?.map((n: TemplateNode) => parseHtmlNode(json, n)) ?? [],
          };
  }
  return unisynthNode;
}
