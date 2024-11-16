import { execa } from 'execa';
import { type BuildConfig, panic } from './util';
import { join } from 'path';

// TODO DRY
export async function tscUnisynth(config: BuildConfig) {
  console.log('tsc unisynth');
  const result = await execa('tsc', ['-p', join(config.srcUnisynthDir, '..', 'tsconfig.json')], {
    stdout: 'inherit',
  });
  if (result.failed) {
    panic(`tsc for unisynth failed`);
  }
}

export async function tscUnisynthCity(config: BuildConfig) {
  console.log('tsc unisynth-city');
  const result = await execa('tsc', ['-p', join(config.srcUnisynthCityDir, '..', 'tsconfig.json')], {
    stdout: 'inherit',
  });
  if (result.failed) {
    panic(`tsc for unisynth failed`);
  }
}

export async function tsc(config: BuildConfig) {
  console.log('tsc');
  const result = await execa('tsc', {
    stdout: 'inherit',
  });
  if (result.failed) {
    panic(`tsc failed`);
  }
}
