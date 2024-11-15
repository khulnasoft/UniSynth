import { UnisynthNode } from '../types/unisynth-node';

export function getBindingsCode(children: UnisynthNode[]): string[] {
  const bindings: string[] = [];
  children.forEach((child) => {
    Object.values(child.bindings || []).forEach((binding) => {
      bindings.push(binding!.code);
    });
    if (child.children) {
      bindings.push(...getBindingsCode(child.children));
    }
  });

  return bindings;
}
