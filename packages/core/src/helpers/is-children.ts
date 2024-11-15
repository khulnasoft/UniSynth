import { UnisynthNode } from '../types/unisynth-node';

export const getTextValue = (node: UnisynthNode) => {
  const textValue = node.bindings._text?.code || node.properties.__text || '';
  return textValue.replace(/\s+/g, '');
};

export default function isChildren({
  node,
  extraMatches = [],
}: {
  node: UnisynthNode;
  extraMatches?: string[];
}): boolean {
  const textValue = getTextValue(node);
  return ['props.children', 'children'].concat(extraMatches).includes(textValue);
}
