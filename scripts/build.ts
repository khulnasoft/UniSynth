import { rmSync } from 'fs';
import { copyFile, watch } from 'fs/promises';
import { join } from 'path';
import { apiExtractorUnisynth, apiExtractorUnisynthCity } from './api';
import { buildPlatformBinding, copyPlatformBindingWasm } from './binding-platform';
import { buildWasmBinding } from './binding-wasm';
import { buildCreateUnisynthCli } from './create-unisynth-cli';
import { buildEslint } from './eslint';
import { buildUnisynthAuth } from './unisynth-auth';
import { buildUnisynthCity } from './unisynth-city';
import { buildUnisynthLabs } from './unisynth-labs';
import { buildUnisynthReact } from './unisynth-react';
import { buildUnisynthWorker } from './unisynth-worker';
import {
  commitPrepareReleaseVersion,
  prepareReleaseVersion,
  publish,
  setDistVersion,
  setReleaseVersion,
} from './release';
import { submoduleBuild } from './submodule-build';
import { submoduleCli } from './submodule-cli';
import { submoduleCore } from './submodule-core';
import { submoduleOptimizer } from './submodule-optimizer';
import { submoduleUnisynthLoader } from './submodule-unisynthloader';
import { submoduleUnisynthPrefetch } from './submodule-unisynthprefetch';
import { submoduleServer } from './submodule-server';
import { submoduleTesting } from './submodule-testing';
import { buildSupabaseAuthHelpers } from './supabase-auth-helpers';
import { tsc, tscUnisynth, tscUnisynthCity } from './tsc';
import { tscDocs } from './tsc-docs';
import { type BuildConfig, emptyDir, ensureDir, panic } from './util';
import { validateBuild } from './validate-build';

/**
 * Complete a full build for all of the package's submodules. Passed in config has all the correct
 * absolute paths to read from and write to. Additionally, a dev build does not empty the directory,
 * and uses esbuild for each of the submodules for speed. A production build will use TSC + Rollup +
 * Terser for the core submodule.
 */
export async function build(config: BuildConfig) {
  config.devRelease = config.devRelease || (!!config.release && config.setDistTag === 'dev');
  try {
    if (config.prepareRelease) {
      // locally set the version for the upcoming release
      await prepareReleaseVersion(config);
    } else if (config.release && !config.dryRun && !config.devRelease) {
      // ci release, npm publish
      await setReleaseVersion(config);
    } else {
      // local build or dev build
      await setDistVersion(config);
    }

    console.log(
      `🌎 Unisynth v${config.distVersion}`,
      `[node ${process.version}, ${process.platform}/${process.arch}]`
    );

    if (config.tsc || (!config.dev && config.unisynth)) {
      rmSync(config.tscDir, { recursive: true, force: true });
      rmSync(config.dtsDir, { recursive: true, force: true });
      await tscUnisynth(config);
    }

    if (config.unisynth) {
      if (config.dev) {
        ensureDir(config.distUnisynthPkgDir);
      } else {
        emptyDir(config.distUnisynthPkgDir);
      }

      await Promise.all([
        submoduleCore(config),
        submoduleUnisynthLoader(config),
        submoduleUnisynthPrefetch(config),
        submoduleBuild(config),
        submoduleTesting(config),
        submoduleCli(config),
      ]);

      // server bundling must happen after the results from the others
      // because it inlines the unisynth loader and prefetch scripts
      await Promise.all([submoduleServer(config), submoduleOptimizer(config)]);
    }

    if (config.api || (!config.dev && config.unisynth)) {
      rmSync(join(config.rootDir, 'dist-dev', 'api'), { recursive: true, force: true });
      rmSync(join(config.rootDir, 'dist-dev', 'api-docs'), { recursive: true, force: true });
      rmSync(join(config.rootDir, 'dist-dev', 'api-extractor'), { recursive: true, force: true });
    }
    if (config.api || ((!config.dev || config.tsc) && config.unisynth)) {
      await apiExtractorUnisynth(config);
    }

    if (config.platformBinding) {
      await buildPlatformBinding(config);
    } else if (config.platformBindingWasmCopy) {
      await copyPlatformBindingWasm(config);
    }

    if (config.wasm) {
      await buildWasmBinding(config);
    }

    if (config.tsc || (!config.dev && config.unisynthcity)) {
      await tscUnisynthCity(config);
    }

    if (config.unisynthcity) {
      await buildUnisynthCity(config);
    }

    if (config.api || ((!config.dev || config.tsc) && config.unisynthcity)) {
      await apiExtractorUnisynthCity(config);
    }

    if (config.tsc) {
      await tsc(config);
    }

    if (config.eslint) {
      await buildEslint(config);
    }

    if (config.unisynthreact) {
      await buildUnisynthReact(config);
    }

    if (config.unisynthauth) {
      await buildUnisynthAuth(config);
    }

    if (config.unisynthworker) {
      await buildUnisynthWorker(config);
    }

    if (config.unisynthlabs) {
      await buildUnisynthLabs(config);
    }

    if (config.supabaseauthhelpers) {
      await buildSupabaseAuthHelpers(config);
    }

    if (config.tscDocs) {
      await tscDocs(config);
    }

    if (config.validate) {
      await validateBuild(config);
    }

    if (config.cli) {
      await buildCreateUnisynthCli(config);
      await submoduleCli(config);
    }

    if (config.prepareRelease) {
      // locally commit the package.json change
      await commitPrepareReleaseVersion(config);
    } else if (config.release) {
      // release from ci
      await publish(config);
    }

    if (config.watch) {
      await watchDirectories({
        [join(config.srcUnisynthDir, 'core')]: async () => {
          await submoduleCore({ ...config, dev: true });
          await copyFile(
            join(config.srcUnisynthDir, '..', 'dist', 'core.cjs'),
            join(config.srcUnisynthDir, '..', 'dist', 'core.prod.cjs')
          );
          await copyFile(
            join(config.srcUnisynthDir, '..', 'dist', 'core.mjs'),
            join(config.srcUnisynthDir, '..', 'dist', 'core.prod.mjs')
          );
          console.log(
            join(config.srcUnisynthDir, '..', 'dist', 'core.cjs'),
            join(config.srcUnisynthDir, '..', 'dist', 'core.prod.cjs')
          );
        },
        [join(config.srcUnisynthDir, 'optimizer')]: () => submoduleOptimizer(config),
        [join(config.srcUnisynthDir, 'prefetch-service-worker')]: () => submoduleUnisynthPrefetch(config),
        [join(config.srcUnisynthDir, 'server')]: () => submoduleServer(config),
        [join(config.srcUnisynthCityDir, 'runtime/src')]: () => buildUnisynthCity(config),
      });
    }
  } catch (e: any) {
    panic(String(e ? e.stack || e : 'Error'));
  }
}

async function watchDirectories(dirs: Record<string, () => Promise<any>>) {
  const promises: Promise<void>[] = [];
  for (const dir of Object.keys(dirs)) {
    promises.push(watchDirectory(dir, dirs[dir]));
  }
  return Promise.all(promises);
}
async function watchDirectory(dir: string, reactionFn: () => Promise<void>) {
  console.log('👀 watching', dir);
  for await (const change of watch(dir, { recursive: true })) {
    console.log('👀 change in', dir, '=>', change.filename);
    try {
      await reactionFn();
    } catch (e) {
      console.error('👀 error', dir, '=>', e);
    }
  }
}
