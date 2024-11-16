import { type BuildConfig, copyDir, panic } from './util';
import { join } from 'node:path';
import { execa } from 'execa';

const PACKAGE = 'unisynth-auth';

export async function buildUnisynthAuth(config: BuildConfig) {
  const input = join(config.packagesDir, PACKAGE);

  const result = await execa('pnpm', ['build'], {
    stdout: 'inherit',
    cwd: input,
  });

  if (result.failed) {
    panic(`tsc failed`);
  }
  await copyDir(
    config,
    join(config.dtsDir, 'packages', 'unisynth-auth', 'src'),
    join(input, 'lib', 'types')
  );
  console.log(`⚛️  ${PACKAGE}`);
}
