import { rules } from '../rules';

const PLUGIN_NAME = '@khulnasoft.com/unisynth' as const;

type RulesKeys = `${typeof PLUGIN_NAME}/${keyof typeof rules}`;

const recommendedRules: Record<RulesKeys, 'error' | 'warn' | 'off' | 0 | 1 | 2> = {
  '@khulnasoft.com/unisynth/css-no-vars': 'error',
  '@khulnasoft.com/unisynth/jsx-callback-arg-name': 'error',
  '@khulnasoft.com/unisynth/jsx-callback-arrow-function': 'error',
  '@khulnasoft.com/unisynth/no-assign-props-to-state': 'error',
  '@khulnasoft.com/unisynth/no-async-methods-on-state': 'error',
  '@khulnasoft.com/unisynth/no-conditional-logic-in-component-render': 'error',
  '@khulnasoft.com/unisynth/no-state-destructuring': 'error',
  '@khulnasoft.com/unisynth/no-var-declaration-in-jsx': 'error',
  '@khulnasoft.com/unisynth/no-var-declaration-or-assignment-in-component': 'error',
  '@khulnasoft.com/unisynth/no-var-name-same-as-state-property': 'error',
  '@khulnasoft.com/unisynth/only-default-function-and-imports': 'error',
  '@khulnasoft.com/unisynth/ref-no-current': 'error',
  '@khulnasoft.com/unisynth/use-state-var-declarator': 'error',
  '@khulnasoft.com/unisynth/static-control-flow': 'error',
  '@khulnasoft.com/unisynth/no-var-name-same-as-prop-name': 'error',
  '@khulnasoft.com/unisynth/no-map-function-in-jsx-return-body': 'warn',
  '@khulnasoft.com/unisynth/no-setter-with-same-name-as-state-prop': 'error',
};

export default {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [PLUGIN_NAME],
  rules: recommendedRules,
};
