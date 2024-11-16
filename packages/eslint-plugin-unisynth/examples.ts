/**
 * @file This file is used as examples in https://unisynth.dev/docs/advanced/eslint/
 *
 *   Call `pnpm eslint.update` to update the examples in the docs.
 */
import { jsxImgExamples } from './src/jsxImg';
import { jsxKeyExamples } from './src/jsxKey';
import { jsxNoScriptUrlExamples } from './src/jsxNoScriptUrl';
import { loaderLocationExamples } from './src/loaderLocation';
import { noReactPropsExamples } from './src/noReactProps';
import { preferClasslistExamples } from './src/preferClasslist';
import { unusedServerExamples } from './src/unusedServer';
import { useMethodUsageExamples } from './src/useMethodUsage';
import { validLexicalScopeExamples } from './src/validLexicalScope';

export type UnisynthEslintExample = {
  code: string;
  codeTitle?: string;
  codeHighlight?: string;
  description?: string;
};

export type UnisynthEslintExamples = Record<
  string,
  {
    good: UnisynthEslintExample[];
    bad: UnisynthEslintExample[];
  }
>;

export const examples = {
  'use-method-usage': useMethodUsageExamples,
  'valid-lexical-scope': validLexicalScopeExamples,
  'loader-location': loaderLocationExamples,
  'no-react-props': noReactPropsExamples,
  'prefer-classlist': preferClasslistExamples,
  'jsx-no-script-url': jsxNoScriptUrlExamples,
  'jsx-key': jsxKeyExamples,
  'unused-server': unusedServerExamples,
  'jsx-img': jsxImgExamples,
};
