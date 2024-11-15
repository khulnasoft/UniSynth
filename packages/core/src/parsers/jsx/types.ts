import { Project } from 'ts-morph';
import { UnisynthComponent } from '../../types/unisynth-component';

export type ParseUnisynthOptions = {
  jsonHookNames?: string[];
  compileAwayPackages?: string[];
  typescript: boolean;
  tsProject?: {
    project: Project;
  };
  filePath?: string;
};

export type Context = {
  // Babel has other context
  khulnasoft: {
    component: UnisynthComponent;
  };
};
