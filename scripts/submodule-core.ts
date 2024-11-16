import { type BuildConfig, rollupOnWarn } from './util';
import { build, type BuildOptions } from 'esbuild';
import { getBanner, fileSize, readFile, target, writeFile } from './util';
import { type InputOptions, type OutputOptions, rollup } from 'rollup';
import { join } from 'node:path';
import { minify } from 'terser';

/**
 * Build the core package which is also the root package: @khulnasoft.com/unisynth
 *
 * Uses esbuild during development (cuz it's super fast) and TSC + Rollup + Terser for production,
 * because it generates smaller code that minifies better.
 */
export function submoduleCore(config: BuildConfig) {
  if (config.dev) {
    return submoduleCoreDev(config);
  }
  return submoduleCoreProd(config);
}

async function submoduleCoreProd(config: BuildConfig) {
  const input: InputOptions = {
    input: join(config.tscDir, 'packages', 'unisynth', 'src', 'core', 'index.js'),
    onwarn: rollupOnWarn,
    external: ['@khulnasoft.com/unisynth/build'],
    plugins: [
      {
        name: 'setVersion',
        generateBundle(_, bundles) {
          for (const f in bundles) {
            const b = bundles[f];
            if (b.type === 'chunk') {
              b.code = b.code.replace(
                'globalThis.UNISYNTH_VERSION',
                JSON.stringify(config.distVersion)
              );
            }
          }
        },
      },
    ],
  };

  const esmOutput: OutputOptions = {
    dir: join(config.distUnisynthPkgDir),
    format: 'es',
    entryFileNames: 'core.mjs',
    sourcemap: true,
    banner: getBanner('@khulnasoft.com/unisynth', config.distVersion),
  };

  const cjsOutput: OutputOptions = {
    dir: join(config.distUnisynthPkgDir),
    format: 'umd',
    name: 'unisynthCore',
    entryFileNames: 'core.cjs',
    sourcemap: true,
    globals: {
      '@khulnasoft.com/unisynth/build': 'unisynthBuild',
    },
    banner: getBanner('@khulnasoft.com/unisynth', config.distVersion),
  };

  const build = await rollup(input);

  await Promise.all([build.write(esmOutput), build.write(cjsOutput)]);

  console.log('🦊 core.mjs:', await fileSize(join(config.distUnisynthPkgDir, 'core.mjs')));

  const inputCore = join(config.distUnisynthPkgDir, 'core.mjs');
  const inputMin: InputOptions = {
    input: inputCore,
    onwarn: rollupOnWarn,
    plugins: [
      {
        name: 'build',
        resolveId(id) {
          if (id === '@index.min') {
            return id;
          }
          if (id === '@khulnasoft.com/unisynth/build') {
            return id;
          }
        },
        load(id) {
          if (id === '@khulnasoft.com/unisynth/build') {
            return `
              export const isServer = false;
              export const isBrowser = true;
              export const isDev = false;
            `;
          }
        },
      },
    ],
  };
  const buildMin = await rollup(inputMin);
  await buildMin.write({
    dir: join(config.distUnisynthPkgDir),
    format: 'es',
    entryFileNames: 'core.min.mjs',
    plugins: [
      {
        name: 'minify',
        async renderChunk(code) {
          const esmMinifyResult = await minify(code, {
            module: true,
            toplevel: true,
            compress: {
              module: true,
              toplevel: true,
              global_defs: {
                // special global that when set to false will remove all dev code entirely
                // developer production builds could use core.min.js directly, or setup
                // their own build tools to define the global `unisynthDev` to false
                'globalThis.qDev': false,
                'globalThis.qInspector': false,
                'globalThis.qSerialize': false,
                'globalThis.qDynamicPlatform': false,
                'globalThis.qTest': false,
                'globalThis.qRuntimeQrl': false,
                'globalThis.UNISYNTH_VERSION': JSON.stringify(config.distVersion),
              },
              ecma: 2020,
              passes: 3,
              pure_getters: true,
              unsafe_symbols: true,
              keep_fargs: false,
            },
            mangle: {
              toplevel: true,
              module: true,
              properties: {
                regex: '^\\$.+\\$$',
              },
            },
            format: {
              comments: /__PURE__/,
              preserve_annotations: true,
              ecma: 2020,
            },
          });
          const esmMinCode = esmMinifyResult.code!;
          const esmCleanCode = esmMinCode.replace(/__self__/g, '__SELF__');

          const selfIdx = esmCleanCode.indexOf('self');
          const indx = Math.max(selfIdx);
          if (indx !== -1) {
            throw new Error(
              `"core.min.mjs" should not have any global references, and should have been removed for a production minified build\n` +
                esmCleanCode.substring(indx, indx + 10) +
                '\n' +
                esmCleanCode.substring(indx - 100, indx + 300)
            );
          }
          return {
            code: esmCleanCode,
          };
        },
      },
    ],
  });

  console.log('🐭 core.min.mjs:', await fileSize(join(config.distUnisynthPkgDir, 'core.min.mjs')));

  let esmCode = await readFile(join(config.distUnisynthPkgDir, 'core.mjs'), 'utf-8');
  let cjsCode = await readFile(join(config.distUnisynthPkgDir, 'core.cjs'), 'utf-8');
  // fixup the Vite base url
  cjsCode = cjsCode.replaceAll('undefined.BASE_URL', 'globalThis.BASE_URL||"/"');
  await writeFile(join(config.distUnisynthPkgDir, 'core.cjs'), cjsCode);

  await submoduleCoreProduction(config, esmCode, join(config.distUnisynthPkgDir, 'core.prod.mjs'));
  await submoduleCoreProduction(config, cjsCode, join(config.distUnisynthPkgDir, 'core.prod.cjs'));
}

async function submoduleCoreProduction(config: BuildConfig, code: string, outPath: string) {
  const result = await minify(code, {
    compress: {
      pure_getters: true,
      unsafe_symbols: true,
      keep_fargs: false,
      join_vars: false,

      global_defs: {
        'globalThis.qDev': false,
        'globalThis.qInspector': false,
        'globalThis.qSerialize': true,
        'globalThis.qDynamicPlatform': true,
        'globalThis.qTest': false,
        'globalThis.qRuntimeQrl': false,
        'globalThis.UNISYNTH_VERSION': JSON.stringify(config.distVersion),
      },
    },
    format: {
      beautify: true,
      braces: true,
      comments: /__PURE__/,
      preserve_annotations: true,
      ecma: 2020,
      preamble: getBanner('@khulnasoft.com/unisynth', config.distVersion),
    },
    mangle: false,
  });
  code = result.code!;

  await writeFile(outPath, code + '\n');
}

async function submoduleCoreDev(config: BuildConfig) {
  const submodule = 'core';

  const opts: BuildOptions = {
    entryPoints: [join(config.srcUnisynthDir, submodule, 'index.ts')],
    entryNames: submodule,
    outdir: config.distUnisynthPkgDir,
    bundle: true,
    sourcemap: 'external',
    target,
    define: {
      'globalThis.UNISYNTH_VERSION': JSON.stringify(config.distVersion),
    },
  };

  const esm = build({
    ...opts,
    external: ['@khulnasoft.com/unisynth/build'],
    format: 'esm',
    outExtension: { '.js': '.mjs' },
  });

  const cjs = build({
    ...opts,
    // we don't externalize unisynth build because then the repl service worker sees require()
    define: {
      ...opts.define,
      // Vite's base url
      'import.meta.env.BASE_URL': '"globalThis.BASE_URL||\'/\'"',
    },
    format: 'cjs',
    outExtension: { '.js': '.cjs' },
    banner: {
      js: `globalThis.unisynthCore = (function (module) {`,
    },
    footer: {
      js: `return module.exports; })(typeof module === 'object' && module.exports ? module : { exports: {} });`,
    },
  });

  await Promise.all([esm, cjs]);

  // Point the minified and prod versions to the dev versions
  await writeFile(
    join(config.distUnisynthPkgDir, 'core.prod.mjs'),
    `export * from './core.mjs';\n`
  );
  await writeFile(
    join(config.distUnisynthPkgDir, 'core.prod.cjs'),
    `module.exports = require('./core.cjs');\n`
  );
  await writeFile(join(config.distUnisynthPkgDir, 'core.min.mjs'), `export * from './core.mjs';\n`);
  await writeFile(
    join(config.distUnisynthPkgDir, 'core.min.cjs'),
    `module.exports = require('./core.cjs');\n`
  );

  console.log('🐬', submodule, '(dev)');
}
