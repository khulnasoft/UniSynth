import { type BuildConfig, panic } from './util';
import { join } from 'node:path';
import { execa } from 'execa';

const PACKAGE = 'unisynth-labs';

export async function buildUnisynthLabs(config: BuildConfig) {
  const input = join(config.packagesDir, PACKAGE);

  const result = await execa('pnpm', ['build'], {
    stdout: 'inherit',
    cwd: input,
  });

  if (result.failed) {
    panic(`tsc failed`);
  }
  console.log(`⚛️  ${PACKAGE}`);
}
