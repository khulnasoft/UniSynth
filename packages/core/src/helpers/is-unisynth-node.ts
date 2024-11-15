import { UnisynthNode } from '../types/unisynth-node';

export const isUnisynthNode = (thing: unknown): thing is UnisynthNode => {
  return Boolean(thing && (thing as any)['@type'] === '@khulnasoft.com/unisynth/node');
};
