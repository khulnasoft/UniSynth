import { isUnisynthNode } from '@/helpers/is-unisynth-node';
import { UnisynthComponent } from '@/types/unisynth-component';
import traverse from 'neotraverse/legacy';

export const getChildComponents = (json: UnisynthComponent): string[] => {
  const nodes: string[] = [];
  const childComponents: string[] = [json.name]; // a component can be recursively used in itself

  traverse(json).forEach(function (item) {
    if (isUnisynthNode(item)) {
      nodes.push(item.name);
    }
  });

  for (const { imports } of json.imports) {
    for (const key of Object.keys(imports)) {
      if (nodes.includes(key)) {
        childComponents.push(key);
      }
    }
  }

  return childComponents;
};
