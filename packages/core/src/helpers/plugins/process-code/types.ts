import { UnisynthComponent } from '../../../types/unisynth-component';
import { UnisynthNode } from '../../../types/unisynth-node';

export type CodeType =
  | 'hooks'
  | 'hooks-deps'
  | 'bindings'
  | 'properties'
  | 'state'
  | 'types'
  | 'context-set'
  // this is for when we write dynamic JSX elements like `<state.foo>Hello</state.foo>` in Unisynth
  | 'dynamic-jsx-elements';

// declare function codeProcessor<T extends CodeType>(
//   codeType: T,
//   json: UnisynthComponent,
// ): (code: string, hookType: T extends 'hooks' ? keyof UnisynthComponent['hooks'] : string) => string;
declare function codeProcessor(
  codeType: CodeType,
  json: UnisynthComponent,
  node?: UnisynthNode,
): (code: string, hookType: string) => string | (() => void);

export type CodeProcessor = typeof codeProcessor;
