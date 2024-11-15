import { componentToReact } from '../generators/react';
import { runTestsForTarget } from './test-generator';

describe('React - stateType: khulnasoft', () => {
  runTestsForTarget({
    options: {
      stateType: 'khulnasoft',
    },
    target: 'react',
    generator: componentToReact,
  });
});
