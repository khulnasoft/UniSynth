import { UnisynthNode } from '../types/unisynth-node';

/**
 * This node is a component, vs a plain html tag (<Foo> vs <div>)
 */
export const isComponent = (json: UnisynthNode) => json.name.toLowerCase() !== json.name;
