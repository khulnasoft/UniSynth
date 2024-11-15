import { UnisynthImport } from '../types/unisynth-component';

export function traceReferenceToModulePath(imports: UnisynthImport[], name: string): string | null {
  let response: string | null = null;
  for (const importInfo of imports) {
    if (name in importInfo.imports) {
      return `${importInfo.path}:${importInfo.imports[name]}`;
    }
  }

  return response;
}
