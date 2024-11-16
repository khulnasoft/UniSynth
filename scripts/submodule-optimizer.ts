import { build, type BuildOptions } from 'esbuild';
import {
  access,
  type BuildConfig,
  getBanner,
  nodeTarget,
  readFile,
  target,
  writeFile,
} from './util';
import { join } from 'node:path';
import { minify } from 'terser';
import { platformArchTriples } from '@napi-rs/triples';
import { constants, existsSync } from 'node:fs';
import { inlineUnisynthScriptsEsBuild } from './submodule-unisynthloader';
import RawPlugin from 'esbuild-plugin-raw';

/** Builds @builder.io/optimizer */
export async function submoduleOptimizer(config: BuildConfig) {
  const submodule = 'optimizer';

  await generatePlatformBindingsData(config);

  async function buildOptimizer() {
    const opts: BuildOptions = {
      entryPoints: [join(config.srcUnisynthDir, submodule, 'src', 'index.ts')],
      entryNames: 'optimizer',
      outdir: config.distUnisynthPkgDir,
      bundle: true,
      sourcemap: false,
      platform: 'node',
      target,
      external: [
        /* no Node.js built-in externals allowed! */
        'espree',
      ],
    };

    const unisynthloaderScripts = await inlineUnisynthScriptsEsBuild(config);

    const esmBuild = build({
      ...opts,
      format: 'esm',
      banner: { js: getBanner('@khulnasoft.com/unisynth/optimizer', config.distVersion) },
      outExtension: { '.js': '.mjs' },
      define: {
        'globalThis.IS_CJS': 'false',
        'globalThis.IS_ESM': 'true',
        'globalThis.UNISYNTH_VERSION': JSON.stringify(config.distVersion),
        ...unisynthloaderScripts,
      },
      plugins: [RawPlugin()],
    });

    const cjsBanner = [`globalThis.unisynthOptimizer = (function (module) {`].join('\n');

    const cjsBuild = build({
      ...opts,
      format: 'cjs',
      banner: { js: cjsBanner },
      footer: {
        js: `return module.exports; })(typeof module === 'object' && module.exports ? module : { exports: {} });`,
      },
      outExtension: { '.js': '.cjs' },
      define: {
        'globalThis.IS_CJS': 'true',
        'globalThis.IS_ESM': 'false',
        'globalThis.UNISYNTH_VERSION': JSON.stringify(config.distVersion),
        ...unisynthloaderScripts,
      },
      target: nodeTarget,
      plugins: [RawPlugin()],
    });

    await Promise.all([esmBuild, cjsBuild]);

    if (!config.dev) {
      const esmDist = join(config.distUnisynthPkgDir, 'optimizer.mjs');
      const cjsDist = join(config.distUnisynthPkgDir, 'optimizer.cjs');

      await Promise.all(
        [esmDist, cjsDist].map(async (p) => {
          const src = await readFile(p, 'utf-8');
          const result = await minify(src, {
            compress: {
              booleans: false,
              collapse_vars: false,
              comparisons: false,
              drop_debugger: false,
              expression: false,
              keep_classnames: true,
              inline: false,
              if_return: false,
              join_vars: false,
              loops: false,
              passes: 1,
              reduce_funcs: false,
              reduce_vars: false,
              sequences: false,
              switches: false,
            },
            format: {
              comments: false,
              braces: true,
              beautify: true,
              indent_level: 2,
              preamble: getBanner('@khulnasoft.com/unisynth/optimizer', config.distVersion),
            },
            mangle: false,
          });
          await writeFile(p, result.code!);
        })
      );
    }

    console.log('🐹', submodule);
  }

  await Promise.all([buildOptimizer()]);
}

async function generatePlatformBindingsData(config: BuildConfig) {
  // generate the platform binding information for only what unisynth provides
  // allows us to avoid using a file system in the optimizer, take a look at:
  // - node_modules/@node-rs/helper/lib/loader.js
  // - node_modules/@napi-rs/triples/index.js

  const unisynthArchTriples: typeof platformArchTriples = {};

  for (const platformName in platformArchTriples) {
    const platform = platformArchTriples[platformName];
    for (const archName in platform) {
      const triples = platform[archName];
      for (const triple of triples) {
        const unisynthArchABI = `unisynth.${triple.platformArchABI}.node`;
        if (existsSync(join(config.distBindingsDir, unisynthArchABI))) {
          const unisynthTriple = {
            platform: triple.platform,
            arch: triple.arch,
            abi: triple.abi,
            platformArchABI: unisynthArchABI,
          };

          unisynthArchTriples[platformName] = unisynthArchTriples[platformName] || {};
          unisynthArchTriples[platformName][archName] = unisynthArchTriples[platformName][archName] || [];
          unisynthArchTriples[platformName][archName].push(unisynthTriple as any);
        }
      }
    }
  }

  const c: string[] = [];
  c.push(`// AUTO-GENERATED IN OPTIMIZER BUILD SCRIPT`);
  c.push(`// created from data provided by @napi-rs/triples`);
  c.push(``);
  c.push(`// prettier-ignore`);
  c.push(`export const UNISYNTH_BINDING_MAP = ${JSON.stringify(unisynthArchTriples, null, 2)};`);

  const code = c.join('\n') + '\n';

  const platformBindingPath = join(config.srcUnisynthDir, 'optimizer', 'src', 'unisynth-binding-map.ts');
  let isWritable;
  try {
    await access(platformBindingPath, constants.W_OK);
    isWritable = true;
  } catch (e) {
    isWritable = false;
  }
  if (isWritable) {
    await writeFile(platformBindingPath, code);
  }
}
