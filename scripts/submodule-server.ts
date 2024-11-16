import { build, type BuildOptions, type Plugin } from 'esbuild';
import { join } from 'node:path';
import { type BuildConfig, getBanner, importPath, nodeTarget, target } from './util';
import { inlineUnisynthScriptsEsBuild } from './submodule-unisynthloader';
import { readPackageJson } from './package-json';

/**
 * Builds @builder.io/server
 *
 * This is submodule for helping to generate server-side rendered pages, along with providing
 * utilities for prerendering and unit testing.
 */
export async function submoduleServer(config: BuildConfig) {
  const submodule = 'server';

  const unisynthDomPlugin = await bundleUnisynthDom(config);
  const unisynthDomVersion = await getUnisynthDomVersion(config);

  const opts: BuildOptions = {
    entryPoints: [join(config.srcUnisynthDir, submodule, 'index.ts')],
    entryNames: 'server',
    outdir: config.distUnisynthPkgDir,
    sourcemap: config.dev,
    bundle: true,
    platform: 'node',
    target,
    external: [
      /* no Node.js built-in externals allowed! */ '@khulnasoft.com/unisynth-dom',
      '@khulnasoft.com/unisynth/build',
    ],
  };

  const esm = build({
    ...opts,
    format: 'esm',
    banner: { js: getBanner('@khulnasoft.com/unisynth/server', config.distVersion) },
    outExtension: { '.js': '.mjs' },
    plugins: [importPath(/^@builder\.io\/unisynth$/, '@khulnasoft.com/unisynth'), unisynthDomPlugin],
    define: {
      ...(await inlineUnisynthScriptsEsBuild(config)),
      'globalThis.IS_CJS': 'false',
      'globalThis.IS_ESM': 'true',
      'globalThis.UNISYNTH_VERSION': JSON.stringify(config.distVersion),
      'globalThis.UNISYNTH_DOM_VERSION': JSON.stringify(unisynthDomVersion),
    },
  });

  const cjsBanner = [
    getBanner('@khulnasoft.com/unisynth/server', config.distVersion),
    `globalThis.unisynthServer = (function (module) {`,
    browserCjsRequireShim,
  ].join('\n');

  const cjs = build({
    ...opts,
    format: 'cjs',
    banner: {
      js: cjsBanner,
    },
    footer: {
      js: `return module.exports; })(typeof module === 'object' && module.exports ? module : { exports: {} });`,
    },
    outExtension: { '.js': '.cjs' },
    plugins: [importPath(/^@builder\.io\/unisynth$/, '@khulnasoft.com/unisynth'), unisynthDomPlugin],
    target: nodeTarget,
    define: {
      ...(await inlineUnisynthScriptsEsBuild(config)),
      'globalThis.IS_CJS': 'true',
      'globalThis.IS_ESM': 'false',
      'globalThis.UNISYNTH_VERSION': JSON.stringify(config.distVersion),
      'globalThis.UNISYNTH_DOM_VERSION': JSON.stringify(unisynthDomVersion),
    },
  });

  await Promise.all([esm, cjs]);

  console.log('🐰', submodule);
}

async function bundleUnisynthDom(config: BuildConfig) {
  const input = join(config.packagesDir, 'unisynth-dom', 'lib', 'index.js');
  const outfile = join(config.tmpDir, 'unisynthdom.mjs');

  const opts: BuildOptions = {
    entryPoints: [input],
    sourcemap: false,
    minify: !config.dev,
    bundle: true,
    target,
    outfile,
    format: 'esm',
  };

  await build(opts);

  const unisynthDomPlugin: Plugin = {
    name: 'unisynthDomPlugin',
    setup(build) {
      build.onResolve({ filter: /@builder.io\/unisynth-dom/ }, () => {
        return {
          path: outfile,
        };
      });
    },
  };

  return unisynthDomPlugin;
}

async function getUnisynthDomVersion(config: BuildConfig) {
  const pkgJsonPath = join(config.packagesDir, 'unisynth-dom');
  const pkgJson = await readPackageJson(pkgJsonPath);
  return pkgJson.version;
}

const browserCjsRequireShim = `
if (typeof require !== 'function' && typeof location !== 'undefined' && typeof navigator !== 'undefined') {
  // shim cjs require() for core.cjs within a browser
  globalThis.require = function(path) {
    if (path === './core.cjs' || path === '@khulnasoft.com/unisynth') {
      if (!self.unisynthCore) {
        throw new Error('Unisynth Core global, "globalThis.unisynthCore", must already be loaded for the Unisynth Server to be used within a browser.');
      }
      return self.unisynthCore;
    }
    if (path === '@khulnasoft.com/unisynth/build') {
      if (!self.unisynthBuild) {
        throw new Error('Unisynth Build global, "globalThis.unisynthBuild", must already be loaded for the Unisynth Server to be used within a browser.');
      }
      return self.unisynthBuild;
    }
    throw new Error('Unable to require() path "' + path + '" from a browser environment.');
  };
}`;
