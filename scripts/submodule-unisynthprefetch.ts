import { type InputOptions, type OutputOptions, rollup } from 'rollup';
import {
  type BuildConfig,
  ensureDir,
  type PackageJSON,
  readFile,
  rollupOnWarn,
  terser,
  writeFile,
} from './util';
import { join } from 'node:path';
import { transform } from 'esbuild';
import { writePackageJson } from './package-json';

/**
 * Builds the unisynthprefetch javascript files. These files can be used by other tooling, and are
 * provided in the package so CDNs could point to them. The @builder.io/optimizer submodule also
 * provides a utility function.
 */
export async function submoduleUnisynthPrefetch(config: BuildConfig) {
  const prefetchSwDir = join(config.srcUnisynthDir, 'prefetch-service-worker');
  const input: InputOptions = {
    input: join(prefetchSwDir, 'entry.ts'),
    plugins: [
      {
        name: 'unisynthPrefetchTranspile',
        resolveId(id) {
          if (!id.endsWith('.ts')) {
            return join(prefetchSwDir, id + '.ts');
          }
          return null;
        },
        async transform(code, id) {
          const result = await transform(code, {
            sourcefile: id,
            target: 'es2017',
            format: 'esm',
            loader: 'ts',
          });
          return result.code;
        },
      },
    ],
    onwarn: rollupOnWarn,
  };

  const defaultMinified: OutputOptions = {
    // UNISYNTH_PREFETCH_DEFAULT_MINIFIED
    dir: config.distUnisynthPkgDir,
    format: 'es',
    entryFileNames: `unisynth-prefetch.js`,
    exports: 'none',
    intro: `(()=>{`,
    outro: `})()`,
    plugins: [
      terser({
        compress: {
          global_defs: {
            'window.BuildEvents': false,
          },
          keep_fargs: false,
          unsafe: true,
          passes: 2,
        },
        mangle: {
          toplevel: true,
          module: true,
          properties: {
            regex: '^\\$.+\\$$',
          },
        },
        format: {
          comments: /@vite/,
        },
      }),
    ],
  };

  const defaultDebug: OutputOptions = {
    // UNISYNTH_PREFETCH_DEFAULT_DEBUG
    dir: config.distUnisynthPkgDir,
    format: 'es',
    entryFileNames: `unisynth-prefetch.debug.js`,
    exports: 'none',
    intro: `(()=>{`,
    outro: `})()`,
    plugins: [
      terser({
        compress: {
          global_defs: {
            'window.BuildEvents': false,
          },
          inline: false,
          join_vars: false,
          loops: false,
          sequences: false,
        },
        format: {
          comments: true,
          beautify: true,
          braces: true,
        },
        mangle: false,
      }),
    ],
  };

  const build = await rollup(input);

  await Promise.all([build.write(defaultMinified), build.write(defaultDebug)]);

  await generatePrefetchSubmodule(config);
}

/** Load each of the unisynth scripts to be inlined with esbuild "define" as const variables. */
export async function inlineUnisynthScriptsEsBuild(config: BuildConfig) {
  const variableToFileMap = [
    ['UNISYNTH_PREFETCH_DEFAULT_MINIFIED', 'unisynth-prefetch.js'],
    ['UNISYNTH_PREFETCH_DEFAULT_DEBUG', 'unisynth-prefetch.debug.js'],
  ];

  const define: { [varName: string]: string } = {};

  await Promise.all(
    variableToFileMap.map(async (varToFile) => {
      const varName = `globalThis.${varToFile[0]}`;
      const filePath = join(config.distUnisynthPkgDir, varToFile[1]);
      const content = await readFile(filePath, 'utf-8');
      define[varName] = JSON.stringify(content.trim());
    })
  );

  return define;
}

async function generatePrefetchSubmodule(config: BuildConfig) {
  const prefetchDistDir = join(config.distUnisynthPkgDir, 'prefetch');

  const prefetchCode = await readFile(join(config.distUnisynthPkgDir, 'unisynth-prefetch.js'), 'utf-8');
  const prefetchDebugCode = await readFile(
    join(config.distUnisynthPkgDir, 'unisynth-prefetch.debug.js'),
    'utf-8'
  );

  const code = [
    `const UNISYNTH_PREFETCH = ${JSON.stringify(prefetchCode.trim())};`,
    `const UNISYNTH_PREFETCH_DEBUG = ${JSON.stringify(prefetchDebugCode.trim())};`,
  ];

  const esmCode = [...code, `export { UNISYNTH_PREFETCH, UNISYNTH_PREFETCH_DEBUG };`];
  const cjsCode = [
    ...code,
    `exports.UNISYNTH_PREFETCH = UNISYNTH_PREFETCH;`,
    `exports.UNISYNTH_PREFETCH_DEBUG = UNISYNTH_PREFETCH_DEBUG;`,
  ];
  const dtsCode = [
    `export declare const UNISYNTH_PREFETCH: string;`,
    `export declare const UNISYNTH_PREFETCH_DEBUG: string;`,
  ];

  ensureDir(prefetchDistDir);
  await writeFile(join(prefetchDistDir, 'index.mjs'), esmCode.join('\n') + '\n');
  await writeFile(join(prefetchDistDir, 'index.cjs'), cjsCode.join('\n') + '\n');
  await writeFile(join(prefetchDistDir, 'index.d.ts'), dtsCode.join('\n') + '\n');

  const prefetchPkg: PackageJSON = {
    name: `@khulnasoft.com/unisynth/prefetch`,
    version: config.distVersion,
    main: `index.mjs`,
    types: `index.d.ts`,
    private: true,
    type: 'module',
  };
  await writePackageJson(prefetchDistDir, prefetchPkg);
}
