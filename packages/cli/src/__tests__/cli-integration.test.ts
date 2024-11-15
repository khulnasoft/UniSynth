import { filesystem, system } from 'gluegun';
import * as path from 'path';
import { expect, test } from 'vitest';

const { version } = require('../../package.json');

const cli = async (cmd: string) => {
  const root = filesystem.path(__dirname, '..', '..');
  const unisynthCliScript = filesystem.path(root, 'bin', 'unisynth');
  const shcmd = `node ${unisynthCliScript} ${cmd}`;
  console.debug(`Running: ${shcmd}`);
  return system.run(shcmd);
};

const TIMEOUT = 20000;

test(
  'outputs version',
  async () => {
    const output = await cli('--version');
    expect(output).toContain(version);
  },
  { timeout: TIMEOUT },
);

test(
  'outputs help',
  async () => {
    const output = await cli('--help');
    expect(output).toContain(version);
  },
  { timeout: TIMEOUT },
);

// TODO refactor commands/compile.ts to not have side effects (like calling
// process.exit) so that this can be unit tested instead.
test(
  'strips out khulnasoft components by default',
  async () => {
    const filepath = path.resolve(__dirname, 'data/triptych.khulnasoft.json');

    const output = await cli(`compile --from=khulnasoft --to=react ${filepath}`);

    expect(output).toMatchSnapshot();
    expect(output).toContain('function MyComponent(props) {');
    expect(output).not.toContain('<Columns');
    expect(output).not.toContain('<Column');
    expect(output).not.toContain('<Image');
    expect(output).toContain('<img');
  },
  { timeout: TIMEOUT },
);

test(
  '--khulnasoft-components keeps khulnasoft components',
  async () => {
    const filepath = path.resolve(__dirname, 'data/triptych.khulnasoft.json');

    const output = await cli(`compile --khulnasoft-components --from=khulnasoft --to=react ${filepath}`);

    expect(output).toMatchSnapshot();
    expect(output).toContain('function MyComponent(props) {');
    expect(output).toContain('<Columns');
    expect(output).toContain('<Column');
    expect(output).toContain('<Image');
    expect(output).not.toContain('<img');
  },
  { timeout: TIMEOUT },
);
