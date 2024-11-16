import { jsxAtag } from './src/jsxAtag';
import { jsxImg } from './src/jsxImg';
import { jsxKey } from './src/jsxKey';
import { jsxNoScriptUrl } from './src/jsxNoScriptUrl';
import { loaderLocation } from './src/loaderLocation';
import { noReactProps } from './src/noReactProps';
import { noUseVisibleTask } from './src/noUseVisibleTask';
import { preferClasslist } from './src/preferClasslist';
import { unusedServer } from './src/unusedServer';
import { useMethodUsage } from './src/useMethodUsage';
import { validLexicalScope } from './src/validLexicalScope';

export const rules = {
  'use-method-usage': useMethodUsage,
  'valid-lexical-scope': validLexicalScope,
  'loader-location': loaderLocation,
  'no-react-props': noReactProps,
  'prefer-classlist': preferClasslist,
  'jsx-no-script-url': jsxNoScriptUrl,
  'jsx-key': jsxKey,
  'unused-server': unusedServer,
  'jsx-img': jsxImg,
  'jsx-a': jsxAtag,
  'no-use-visible-task': noUseVisibleTask,
};

export const configs = {
  recommended: {
    plugins: ['unisynth'],
    rules: {
      'unisynth/use-method-usage': 'error',
      'unisynth/valid-lexical-scope': 'error',
      'unisynth/no-react-props': 'error',
      'unisynth/prefer-classlist': 'warn',
      'unisynth/jsx-no-script-url': 'warn',
      'unisynth/loader-location': 'warn',
      'unisynth/jsx-key': 'warn',
      'unisynth/unused-server': 'error',
      'unisynth/jsx-img': 'warn',
      'unisynth/jsx-a': 'warn',
      'unisynth/no-use-visible-task': 'warn',
    },
  },
  strict: {
    plugins: ['unisynth'],
    rules: {
      'unisynth/valid-lexical-scope': 'error',
      'unisynth/use-method-usage': 'error',
      'unisynth/loader-location': 'error',
      'unisynth/no-react-props': 'error',
      'unisynth/prefer-classlist': 'error',
      'unisynth/jsx-no-script-url': 'error',
      'unisynth/jsx-key': 'error',
      'unisynth/unused-server': 'error',
      'unisynth/jsx-img': 'error',
      'unisynth/jsx-a': 'error',
      'unisynth/no-use-visible-task': 'warn',
    },
  },
};
