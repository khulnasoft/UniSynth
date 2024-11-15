import { BaseTranspilerOptions } from '@/types/transpiler';

export interface ToUnisynthOptions extends BaseTranspilerOptions {
  format: 'react' | 'legacy';
  nativeConditionals?: boolean;
  nativeLoops?: boolean;
  returnArray?: boolean;
}

export type UnisynthMetadata = {};
