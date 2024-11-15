import { componentToUnisynth } from '@/generators/unisynth';
import { runTestsForTarget } from './test-generator';

describe('Unisynth, format: legacy', () => {
  runTestsForTarget({
    options: { format: 'legacy' },
    target: 'unisynth',
    generator: componentToUnisynth,
  });
});

describe('Unisynth, format: legacy (native loops and conditionals)', () => {
  runTestsForTarget({
    options: {
      format: 'legacy',
      nativeLoops: true,
      nativeConditionals: true,
      returnArray: true,
    },
    target: 'unisynth',
    generator: componentToUnisynth,
  });
});

describe('Unisynth, format: react', () => {
  runTestsForTarget({
    options: {
      format: 'react',
    },
    target: 'unisynth',
    generator: componentToUnisynth,
  });
});
