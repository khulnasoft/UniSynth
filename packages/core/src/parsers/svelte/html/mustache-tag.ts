import { generate } from 'astring';
import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import { createSingleBinding } from '../../../helpers/bindings';
import { createUnisynthNode } from '../helpers/unisynth-node';

export function parseMustacheTag(node: TemplateNode) {
  const unisynthNode = createUnisynthNode();
  unisynthNode.name = 'div';
  unisynthNode.bindings['_text'] = createSingleBinding({
    code: generate(node.expression),
  });
  return unisynthNode;
}

export function parseRawMustacheTag(node: TemplateNode) {
  const unisynthNode = createUnisynthNode();
  unisynthNode.name = 'div';
  unisynthNode.bindings.innerHTML = createSingleBinding({
    code: generate(node.expression),
  });
  return unisynthNode;
}
