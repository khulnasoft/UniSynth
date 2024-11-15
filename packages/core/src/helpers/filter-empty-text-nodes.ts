import { UnisynthNode } from '../types/unisynth-node';

export const isEmptyTextNode = (node: UnisynthNode) => {
  return typeof node.properties._text === 'string' && node.properties._text.trim().length === 0;
};

export const filterEmptyTextNodes = (node: UnisynthNode) => !isEmptyTextNode(node);
