import { BaseTranspilerOptions } from '@/types/transpiler';
import { UnisynthComponent } from '@/types/unisynth-component';

export const BUILT_IN_COMPONENTS = new Set(['Show', 'For', 'Fragment', 'Slot']);

export interface ToAngularOptions extends BaseTranspilerOptions {
  state?: 'class-properties' | 'inline-with-wrappers';
  standalone?: boolean;
  preserveImports?: boolean;
  preserveFileExtensions?: boolean;
  importMapper?: Function;
  bootstrapMapper?: Function;
  visuallyIgnoreHostElement?: boolean;
  experimental?: {
    injectables?: (variableName: string, variableType: string) => string;
    inject?: boolean;
    outputs?: (json: UnisynthComponent, variableName: string) => string;
  };
}

export const DEFAULT_ANGULAR_OPTIONS: ToAngularOptions = {
  state: 'inline-with-wrappers',
  preserveImports: false,
  preserveFileExtensions: false,
  visuallyIgnoreHostElement: true,
};

export type AngularMetadata = {
  /* Unisynth uses `attr.XXX` as default see https://angular.io/guide/attribute-binding. 
  If you want to skip some you can use the 'nativeAttributes'. */
  nativeAttributes?: string[];
  /* Overwrite default selector for component. Default will be kebab case (MyComponent -> my-component) */
  selector?: string;
};

export type AngularBlockOptions = {
  childComponents?: string[];
} & AngularMetadata;