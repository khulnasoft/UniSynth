import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import type { UnisynthNode } from '../../../types/unisynth-node';
import { parseHtmlNode } from '../html';
import type { SveltosisComponent } from '../types';

export function filterChildren(children: TemplateNode[]) {
  return (
    children?.filter((n) => n.type !== 'Comment' && (n.type !== 'Text' || n.data?.trim().length)) ??
    []
  );
}

export function parseChildren(json: SveltosisComponent, node: TemplateNode) {
  const children: UnisynthNode[] = [];

  if (node.children) {
    for (const child of filterChildren(node.children)) {
      const unisynthNode = parseHtmlNode(json, child);
      if (unisynthNode) {
        children.push(unisynthNode);
      }
    }
  }

  return children;
}
