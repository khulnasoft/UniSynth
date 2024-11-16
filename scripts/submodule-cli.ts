import { build } from 'esbuild';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { copyStartersDir } from './create-unisynth-cli';
import { type BuildConfig, copyDir, getBanner, nodeTarget } from './util';

/** Builds @khulnasoft.com/unisynth/cli */
export async function submoduleCli(config: BuildConfig) {
  const submodule = 'cli';

  await build({
    entryPoints: [join(config.srcUnisynthDir, submodule, 'index.ts')],
    outfile: join(config.distUnisynthPkgDir, 'cli.cjs'),
    format: 'cjs',
    platform: 'node',
    target: nodeTarget,
    sourcemap: false,
    bundle: true,
    banner: { js: getBanner('@khulnasoft.com/unisynth/cli', config.distVersion) },
    outExtension: { '.js': '.cjs' },
    plugins: [
      {
        name: 'colorAlias',
        setup(build) {
          build.onResolve({ filter: /^chalk$/ }, async (args) => {
            const result = await build.resolve('kleur', {
              resolveDir: args.resolveDir,
              kind: 'import-statement',
            });
            if (result.errors.length > 0) {
              return { errors: result.errors };
            }
            return { path: result.path };
          });
        },
      },
    ],
    external: ['prettier', 'typescript'],
    define: {
      'globalThis.CODE_MOD': 'true',
      'globalThis.UNISYNTH_VERSION': JSON.stringify(config.distVersion),
    },
  });

  await copyStartersDir(config, config.distUnisynthPkgDir, ['features', 'adapters']);

  const tmplSrc = join(config.startersDir, 'templates');
  const tmplDist = join(config.distUnisynthPkgDir, 'templates');

  if (existsSync(tmplDist)) {
    rmSync(tmplDist, { recursive: true });
  }

  await copyDir(config, tmplSrc, tmplDist);

  console.log('📠', submodule);
}
