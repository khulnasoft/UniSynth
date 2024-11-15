import { Dictionary } from '../helpers/typescript';
import { Target } from './config';
import { JSONObject } from './json';
import { ComponentMetadata } from './metadata';
import { UnisynthNode } from './unisynth-node';

/**
 * @example
 *  // import core, { useState, someThing as someAlias } from '@khulnasoft.com/unisynth'
 *  {
 *    path: '@khulnasoft.com/unisynth',
 *    imports: {
 *      useState: 'useState',
 *      someAlias: 'someThing',
 *      core: 'default',
 *    }
 *  }
 *
 * @example
 *  // import * as core from '@khulnasoft.com/unisynth'
 *  {
 *    path: '@khulnasoft.com/unisynth',
 *    imports: {
 *      core: '*',
 *    }
 *  }
 */
export interface UnisynthImport {
  path: string;
  imports: {
    [key: string]: string | undefined;
  };
  importKind?: 'type' | 'typeof' | 'value' | null;
}

export type ReactivityType = 'normal' | 'reactive';

export type ContextOptions = {
  type?: ReactivityType;
};
export interface ContextGetInfo extends ContextOptions {
  name: string;
  path: string;
}
export interface ContextSetInfo extends ContextOptions {
  name: string;
  value?: UnisynthState;
  ref?: string;
}

export type BaseHook = { code: string; deps?: string };

export type UnisynthComponentInput = {
  name: string;
  defaultValue: any;
};

export type UnisynthExports = {
  [name: string]: UnisynthExport;
};

export interface UnisynthExport {
  code: string;
  usedInLocal?: boolean;
  isFunction?: boolean;
}

export type StateValueType = 'function' | 'getter' | 'method' | 'property';

export type StateValue = {
  code: string;
  typeParameter?: string;
  type: StateValueType;
  propertyType?: ReactivityType;
};

export type UnisynthState = Dictionary<StateValue | undefined>;

export type TargetBlock<Return, Targets extends Target = Target> = Partial<{
  [T in Targets | 'default']?: Return;
}>;

export type TargetBlockCode = TargetBlock<{
  code: string;
}>;

export type TargetBlockDefinition = TargetBlockCode & {
  settings: {
    requiresDefault: boolean;
  };
};

export type OnEventHook = BaseHook & {
  refName: string;
  eventName: string;
  isRoot: boolean;
  deps?: never;
  eventArgName: string;
  elementArgName?: string;
};

export type OnMountHook = BaseHook & {
  onSSR?: boolean;
};

export type UnisynthComponent = {
  '@type': '@khulnasoft.com/unisynth/component';
  name: string;
  imports: UnisynthImport[];
  exports?: UnisynthExports;
  meta: JSONObject & {
    useMetadata?: ComponentMetadata;
  };
  inputs: UnisynthComponentInput[];
  state: UnisynthState;
  context: {
    get: Dictionary<ContextGetInfo>;
    set: Dictionary<ContextSetInfo>;
  };
  signals?: {
    signalTypeImportName?: string;
  };
  props?: {
    [name: string]: {
      propertyType: ReactivityType;
      optional: boolean;
    };
  };
  refs: {
    [useRef: string]: {
      typeParameter?: string;
      argument: string;
    };
  };
  hooks: {
    init?: BaseHook;
    onInit?: BaseHook;
    onMount: OnMountHook[];
    onUnMount?: BaseHook;
    preComponent?: BaseHook;
    postComponent?: BaseHook;
    onUpdate?: BaseHook[];
    onEvent: OnEventHook[];
  };
  targetBlocks?: Dictionary<TargetBlockDefinition>;
  children: UnisynthNode[];
  subComponents: UnisynthComponent[];
  types?: string[];
  propsTypeRef?: string;
  defaultProps?: UnisynthState;
  style?: string;
  /**
   * Used to store context of a component for a specific framework
   * that we need access only during compilation (for internal use only) and gets removed after compilation.
   */
  compileContext?: {
    [K in Target]?: {
      state?: UnisynthState;
      hooks?: {
        [hookName: string]: BaseHook;
      };
    };
  };
};
