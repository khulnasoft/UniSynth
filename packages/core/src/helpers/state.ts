import { UnisynthComponent } from '../types/unisynth-component';

export const checkHasState = (component: UnisynthComponent) =>
  Boolean(Object.keys(component.state).length);
