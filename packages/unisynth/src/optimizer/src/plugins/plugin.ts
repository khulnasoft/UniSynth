import type { Rollup, Plugin, ViteDevServer, HmrContext } from 'vite';
import { hashCode } from '../../../core/util/hash_code';
import { generateManifestFromBundles, getValidManifest } from '../manifest';
import { createOptimizer } from '../optimizer';
import type {
  Diagnostic,
  EntryStrategy,
  GlobalInjections,
  SegmentAnalysis,
  InsightManifest,
  Optimizer,
  OptimizerOptions,
  OptimizerSystem,
  UnisynthManifest,
  TransformModule,
  TransformModuleInput,
  TransformModulesOptions,
  TransformOutput,
} from '../types';
import { createLinter, type UnisynthLinter } from './eslint-plugin';
import type { LoadResult, OutputBundle, ResolveIdResult, TransformResult } from 'rollup';
import { isWin } from './vite-utils';

const REG_CTX_NAME = ['server'];

const SERVER_STRIP_EXPORTS = [
  'onGet',
  'onPost',
  'onPut',
  'onRequest',
  'onDelete',
  'onHead',
  'onOptions',
  'onPatch',
  'onStaticGenerate',
];

const SERVER_STRIP_CTX_NAME = [
  'useServer',
  'route',
  'server',
  'action$',
  'loader$',
  'zod$',
  'validator$',
  'globalAction$',
];
const CLIENT_STRIP_CTX_NAME = [
  'useClient',
  'useBrowser',
  'useVisibleTask',
  'client',
  'browser',
  'event$',
];

/**
 * Use `__EXPERIMENTAL__.x` to check if feature `x` is enabled. It will be replaced with `true` or
 * `false` via an exact string replacement.
 *
 * Add experimental features to this enum definition.
 *
 * @alpha
 */
export enum ExperimentalFeatures {
  /** Enable the usePreventNavigate hook */
  preventNavigate = 'preventNavigate',
  /** Enable the Valibot form validation */
  valibot = 'valibot',
  /** Disable SPA navigation handler in Unisynth City */
  noSPA = 'noSPA',
}

export interface UnisynthPackages {
  id: string;
  path: string;
}

export function createPlugin(optimizerOptions: OptimizerOptions = {}) {
  const id = `${Math.round(Math.random() * 899) + 100}`;

  const clientResults = new Map<string, TransformOutput>();
  const clientTransformedOutputs = new Map<string, [TransformModule, string]>();

  const serverTransformedOutputs = new Map<string, [TransformModule, string]>();
  const parentIds = new Map<string, string>();

  let internalOptimizer: Optimizer | null = null;
  let linter: UnisynthLinter | undefined = undefined;
  let diagnosticsCallback: (
    d: Diagnostic[],
    optimizer: Optimizer,
    srcDir: string
  ) => void = () => {};

  const opts: NormalizedUnisynthPluginOptions = {
    csr: false,
    target: 'client',
    buildMode: 'development',
    debug: false,
    rootDir: null as any,
    tsconfigFileNames: ['./tsconfig.json'],
    input: null as any,
    outDir: null as any,
    assetsDir: null as any,
    resolveUnisynthBuild: true,
    entryStrategy: null as any,
    srcDir: null as any,
    srcInputs: null as any,
    sourcemap: !!optimizerOptions.sourcemap,
    manifestInput: null,
    insightsManifest: null,
    manifestOutput: null,
    transformedModuleOutput: null,
    scope: null,
    devTools: {
      imageDevTools: true,
      clickToSource: ['Alt'],
    },
    inlineStylesUpToBytes: null as any,
    lint: true,
    experimental: undefined,
  };

  let lazyNormalizePath: (id: string) => string;
  const init = async () => {
    if (!internalOptimizer) {
      internalOptimizer = await createOptimizer(optimizerOptions);
      lazyNormalizePath = makeNormalizePath(internalOptimizer.sys);
    }
  };

  const getOptimizer = () => {
    if (!internalOptimizer) {
      throw new Error(`Unisynth plugin has not been initialized`);
    }
    return internalOptimizer;
  };

  const getSys = () => {
    const optimizer = getOptimizer();
    return optimizer.sys;
  };

  const getPath = () => {
    const optimizer = getOptimizer();
    return optimizer.sys.path;
  };

  let devServer: ViteDevServer | undefined;
  const configureServer = (server: ViteDevServer) => {
    devServer = server;
  };

  /** Note that as a side-effect this updates the internal plugin `opts` */
  const normalizeOptions = (inputOpts?: UnisynthPluginOptions) => {
    const updatedOpts: UnisynthPluginOptions = Object.assign({}, inputOpts);

    const optimizer = getOptimizer();
    const path = optimizer.sys.path;

    opts.debug = !!updatedOpts.debug;

    if (updatedOpts.assetsDir) {
      opts.assetsDir = updatedOpts.assetsDir;
    }

    if (
      updatedOpts.target === 'ssr' ||
      updatedOpts.target === 'client' ||
      updatedOpts.target === 'lib' ||
      updatedOpts.target === 'test'
    ) {
      opts.target = updatedOpts.target;
    } else {
      opts.target = 'client';
    }

    if (opts.target === 'lib') {
      opts.buildMode = 'development';
    } else if (updatedOpts.buildMode === 'production' || updatedOpts.buildMode === 'development') {
      opts.buildMode = updatedOpts.buildMode;
    } else {
      opts.buildMode = 'development';
    }

    if (updatedOpts.entryStrategy && typeof updatedOpts.entryStrategy === 'object') {
      opts.entryStrategy = { ...updatedOpts.entryStrategy };
    }
    if (!opts.entryStrategy) {
      if (opts.target === 'ssr' || opts.target === 'test') {
        opts.entryStrategy = { type: 'hoist' };
      } else if (opts.target === 'lib') {
        opts.entryStrategy = { type: 'inline' };
      } else {
        if (opts.buildMode === 'production') {
          opts.entryStrategy = { type: 'smart' };
        } else {
          opts.entryStrategy = { type: 'segment' };
        }
      }
    }

    if (typeof updatedOpts.rootDir === 'string') {
      opts.rootDir = updatedOpts.rootDir;
    }
    if (typeof opts.rootDir !== 'string') {
      opts.rootDir = optimizer.sys.cwd();
    }
    opts.rootDir = normalizePath(path.resolve(optimizer.sys.cwd(), opts.rootDir));
    let srcDir = normalizePath(path.resolve(opts.rootDir, SRC_DIR_DEFAULT));
    if (typeof updatedOpts.srcDir === 'string') {
      opts.srcDir = normalizePath(path.resolve(opts.rootDir, updatedOpts.srcDir));
      srcDir = opts.srcDir;
      opts.srcInputs = null;
    } else if (Array.isArray(updatedOpts.srcInputs)) {
      opts.srcInputs = [...updatedOpts.srcInputs];
      opts.srcDir = null;
    } else {
      opts.srcDir = srcDir;
    }

    if (Array.isArray(updatedOpts.tsconfigFileNames) && updatedOpts.tsconfigFileNames.length > 0) {
      opts.tsconfigFileNames = updatedOpts.tsconfigFileNames;
    }

    if (Array.isArray(opts.srcInputs)) {
      opts.srcInputs.forEach((i) => {
        i.path = normalizePath(path.resolve(opts.rootDir, i.path));
      });
    } else if (typeof opts.srcDir === 'string') {
      opts.srcDir = normalizePath(path.resolve(opts.rootDir, normalizePath(opts.srcDir)));
    }

    if (!updatedOpts.csr) {
      if (Array.isArray(updatedOpts.input)) {
        opts.input = [...updatedOpts.input];
      } else if (typeof updatedOpts.input === 'string') {
        opts.input = [updatedOpts.input];
      } else {
        if (opts.target === 'ssr') {
          // ssr input default
          opts.input = [path.resolve(srcDir, 'entry.ssr')];
        } else if (opts.target === 'client') {
          // client input default
          opts.input = [path.resolve(srcDir, 'root')];
        } else if (opts.target === 'lib') {
          if (typeof updatedOpts.input === 'object') {
            for (const key in updatedOpts.input) {
              const resolvedPaths: { [key: string]: string } = {};
              if (Object.hasOwnProperty.call(updatedOpts.input, key)) {
                const relativePath = updatedOpts.input[key];
                const absolutePath = path.resolve(opts.rootDir, relativePath);
                resolvedPaths[key] = absolutePath;
              }

              opts.input = { ...opts.input, ...resolvedPaths };
            }
          } else {
            // lib input default
            opts.input = [path.resolve(srcDir, 'index.ts')];
          }
        } else {
          opts.input = [];
        }
      }
      opts.input = Array.isArray(opts.input)
        ? opts.input.reduce((inputs, i) => {
            let input = i;
            if (!i.startsWith('@') && !i.startsWith('~') && !i.startsWith('#')) {
              input = normalizePath(path.resolve(opts.rootDir, i));
            }
            if (!inputs.includes(input)) {
              inputs.push(input);
            }
            return inputs;
          }, [] as string[])
        : opts.input;

      if (typeof updatedOpts.outDir === 'string') {
        opts.outDir = normalizePath(path.resolve(opts.rootDir, normalizePath(updatedOpts.outDir)));
      } else {
        if (opts.target === 'ssr') {
          opts.outDir = normalizePath(path.resolve(opts.rootDir, SSR_OUT_DIR));
        } else if (opts.target === 'lib') {
          opts.outDir = normalizePath(path.resolve(opts.rootDir, LIB_OUT_DIR));
        } else {
          opts.outDir = normalizePath(path.resolve(opts.rootDir, CLIENT_OUT_DIR));
        }
      }
    }

    if (typeof updatedOpts.manifestOutput === 'function') {
      opts.manifestOutput = updatedOpts.manifestOutput;
    }

    const clientManifest = getValidManifest(updatedOpts.manifestInput);
    if (clientManifest) {
      opts.manifestInput = clientManifest;
    }

    if (typeof updatedOpts.transformedModuleOutput === 'function') {
      opts.transformedModuleOutput = updatedOpts.transformedModuleOutput;
    }

    opts.scope = updatedOpts.scope ?? null;

    if (typeof updatedOpts.resolveUnisynthBuild === 'boolean') {
      opts.resolveUnisynthBuild = updatedOpts.resolveUnisynthBuild;
    }

    if (typeof updatedOpts.devTools === 'object') {
      if ('imageDevTools' in updatedOpts.devTools) {
        opts.devTools.imageDevTools = updatedOpts.devTools.imageDevTools;
      }

      if ('clickToSource' in updatedOpts.devTools) {
        opts.devTools.clickToSource = updatedOpts.devTools.clickToSource;
      }
    }
    opts.csr = !!updatedOpts.csr;

    opts.inlineStylesUpToBytes = optimizerOptions.inlineStylesUpToBytes ?? 20000;
    if (typeof opts.inlineStylesUpToBytes !== 'number' || opts.inlineStylesUpToBytes < 0) {
      opts.inlineStylesUpToBytes = 0;
    }

    if (typeof updatedOpts.lint === 'boolean') {
      opts.lint = updatedOpts.lint;
    } else {
      opts.lint = updatedOpts.buildMode === 'development';
    }

    opts.experimental = undefined;
    for (const feature of updatedOpts.experimental ?? []) {
      if (!ExperimentalFeatures[feature as ExperimentalFeatures]) {
        console.error(`Unisynth plugin: Unknown experimental feature: ${feature}`);
      } else {
        (opts.experimental ||= {} as any)[feature] = true;
      }
    }

    return { ...opts };
  };

  let hasValidatedSource = false;

  const validateSource = async (resolver: (id: string) => Promise<unknown | undefined>) => {
    if (!hasValidatedSource) {
      hasValidatedSource = true;

      const sys = getSys();
      if (sys.env === 'node') {
        const fs: typeof import('fs') = await sys.dynamicImport('node:fs');
        if (!fs.existsSync(opts.rootDir)) {
          throw new Error(`Unisynth rootDir "${opts.rootDir}" not found.`);
        }
        if (typeof opts.srcDir === 'string' && !fs.existsSync(opts.srcDir)) {
          throw new Error(`Unisynth srcDir "${opts.srcDir}" not found.`);
        }
        for (const [_, input] of Object.entries(opts.input || {})) {
          const resolved = await resolver(input);
          if (!resolved) {
            throw new Error(`Unisynth input "${input}" not found.`);
          }
        }
      }
    }
  };

  let optimizer: Optimizer;
  const buildStart = async (_ctx: Rollup.PluginContext) => {
    debug(`buildStart()`, opts.buildMode, opts.scope, opts.target, opts.rootDir, opts.srcDir);
    optimizer = getOptimizer();
    if (optimizer.sys.env === 'node' && opts.target === 'ssr' && opts.lint) {
      try {
        linter = await createLinter(optimizer.sys, opts.rootDir, opts.tsconfigFileNames);
      } catch {
        // Nothing
      }
    }

    const path = getPath();

    if (Array.isArray(opts.srcInputs)) {
      optimizer.sys.getInputFiles = async (rootDir) =>
        opts.srcInputs!.map((i) => {
          const relInput: TransformModuleInput = {
            path: normalizePath(path.relative(rootDir, i.path)),
            code: i.code,
          };
          return relInput;
        });
      debug(`buildStart() opts.srcInputs (${opts.srcInputs.length} files)`);
    }

    debug(`transformedOutputs.clear()`);
    clientTransformedOutputs.clear();
    serverTransformedOutputs.clear();
  };

  const getIsServer = (viteOpts?: { ssr?: boolean }) => {
    return devServer ? !!viteOpts?.ssr : opts.target === 'ssr' || opts.target === 'test';
  };

  let resolveIdCount = 0;
  /**
   * This resolves virtual names and QRL segments/entries. All the rest falls through. We must
   * always return a value for QRL segments because they don't exist on disk.
   *
   * Note: During development, the QRL filenames will be of the form
   * `${parentUrl}_${name}_${hash}.js`, and we might get requests for QRLs from the client before
   * the parent was built. That means we need to recover the parent from the URL and then in the
   * `load()` phase ensure it is built first.
   */
  const resolveId = async (
    ctx: Rollup.PluginContext,
    id: string,
    importerId: string | undefined,
    resolveOpts?: Parameters<Extract<Plugin['resolveId'], Function>>[2]
  ) => {
    if (id.startsWith('\0')) {
      return;
    }
    const count = resolveIdCount++;
    const isServer = getIsServer(resolveOpts);
    debug(`resolveId(${count})`, `begin ${id} | ${isServer ? 'server' : 'client'} | ${importerId}`);

    const parsedImporterId = importerId && parseId(importerId);
    importerId = parsedImporterId && normalizePath(parsedImporterId.pathId);

    // Relative paths must be resolved vs the importer
    if (id.startsWith('.') && parsedImporterId) {
      const path = getPath();
      const importerDir = path.dirname(parsedImporterId.pathId);
      if (importerDir) {
        id = path.resolve(importerDir, id);
      }
    }

    // Split query, remove windows path encoding etc
    const parsedId = parseId(id);
    const pathId = normalizePath(parsedId.pathId);

    let result: ResolveIdResult;

    /** At this point, the request has been normalized. */

    if (
      /**
       * Check if we know the QRL. During regular builds, we'll encounter and build parents before
       * their QRLs, so this will always match.
       */
      parentIds.get(pathId)
    ) {
      debug(`resolveId(${count}) Resolved already known ${pathId}`);
      result = {
        id: pathId + parsedId.query,
        moduleSideEffects: false,
      };
    } else if (
      /**
       * Now the requests we handle are for one of the virtual modules, or a QRL segment that hasn't
       * been transformed yet.
       */

      // We test with endsWith because the dev server adds the base pathname
      pathId.endsWith(UNISYNTH_BUILD_ID)
    ) {
      if (opts.resolveUnisynthBuild) {
        debug(`resolveId(${count})`, 'Resolved', UNISYNTH_BUILD_ID);
        result = {
          id: UNISYNTH_BUILD_ID,
          moduleSideEffects: false,
        };
      }
    } else if (pathId.endsWith(UNISYNTH_CLIENT_MANIFEST_ID)) {
      debug(`resolveId(${count})`, 'Resolved', UNISYNTH_CLIENT_MANIFEST_ID);
      result = {
        id: UNISYNTH_CLIENT_MANIFEST_ID,
        moduleSideEffects: false,
      };
    } else {
      const qrlMatch = /^(?<parent>.*\.[mc]?[jt]sx?)_(?<name>[^/]+)\.js(?<query>$|\?.*$)/.exec(id)
        ?.groups as { parent: string; name: string; query: string } | undefined;

      /**
       * If this looks like a dev qrl filename, it doesn't matter who imports, we have the parentId
       * embedded.
       */
      if (qrlMatch) {
        const { parent, name, query } = qrlMatch;

        const resolvedParent = await ctx.resolve(parent, importerId, { skipSelf: true });
        if (resolvedParent) {
          // Vite likes to add ?v=1234... to the end of the id
          const parentId = resolvedParent.id.split('?')[0];
          /**
           * A request possibly from the browser. It could be our own QRL request or an import URL
           * generated by vite. In any case, only Vite fully knows how to resolve it. Therefore, we
           * must recombine the resolved parent path with the QRL name.
           */
          const isDevUrl = devServer && importerId?.endsWith('.html');
          const resolvedId = isDevUrl ? `${parentId}_${name}.js` : pathId;
          debug(`resolveId(${count})`, `resolved to QRL ${name} of ${parentId}`);
          // Save for lookup by load()
          parentIds.set(resolvedId, parentId);
          result = {
            id: resolvedId + query,
            // QRL segments can't have side effects. Probably never useful, but it's here for consistency
            moduleSideEffects: false,
          };
        } else {
          console.error(`resolveId(${count})`, `QRL parent ${parent} does not exist!`);
        }
      } else if (importerId) {
        /**
         * When we get here it's neither a virtual module nor a QRL segment. However, Rollup can ask
         * us to resolve imports from QRL segments. It seems like importers need to exist on disk
         * for this to work automatically, so for segments we resolve via the parent instead.
         *
         * Note that when a this happens, the segment was already resolved and transformed, so we
         * know about it.
         */
        const importerParentId = parentIds.get(importerId);
        if (importerParentId) {
          debug(`resolveId(${count}) end`, `resolving via ${importerParentId}`);
          // This returns a promise that we can't await because of deadlocking
          return ctx.resolve(id, importerParentId, { skipSelf: true });
        }
      }
    }

    debug(`resolveId(${count}) end`, (result as any)?.id || result);
    return result;
  };

  let loadCount = 0;
  const load = async (
    ctx: Rollup.PluginContext,
    id: string,
    loadOpts?: Parameters<Extract<Plugin['load'], Function>>[1]
  ): Promise<LoadResult> => {
    if (id.startsWith('\0') || id.startsWith('/@fs/')) {
      return;
    }
    const count = loadCount++;
    const isServer = getIsServer(loadOpts);

    // Virtual modules
    if (opts.resolveUnisynthBuild && id === UNISYNTH_BUILD_ID) {
      debug(`load(${count})`, UNISYNTH_BUILD_ID, opts.buildMode);
      return {
        moduleSideEffects: false,
        code: getUnisynthBuildModule(isServer, opts.target),
      };
    }
    if (id === UNISYNTH_CLIENT_MANIFEST_ID) {
      debug(`load(${count})`, UNISYNTH_CLIENT_MANIFEST_ID, opts.buildMode);
      return {
        moduleSideEffects: false,
        code: await getUnisynthServerManifestModule(isServer),
      };
    }

    // QRL segments
    const parsedId = parseId(id);
    id = normalizePath(parsedId.pathId);
    const outputs = isServer ? serverTransformedOutputs : clientTransformedOutputs;
    if (devServer && !outputs.has(id)) {
      // in dev mode, it could be that the id is a QRL segment that wasn't transformed yet
      const parentId = parentIds.get(id);
      if (parentId) {
        const parentModule = devServer.moduleGraph.getModuleById(parentId);
        if (parentModule) {
          // building here via ctx.load doesn't seem to work (no transform), instead we use the devserver directly
          debug(`load(${count})`, 'transforming QRL parent', parentId);
          // We need to encode it as an absolute path
          await devServer.transformRequest(parentModule.url);
          // The QRL segment should exist now
          if (!outputs.has(id)) {
            debug(`load(${count})`, `QRL segment ${id} not found in ${parentId}`);
            return null;
          }
        } else {
          console.error(`load(${count})`, `${parentModule} does not exist!`);
        }
      }
    }

    const transformedModule = outputs.get(id);

    if (transformedModule) {
      debug(`load(${count})`, 'Found', id);
      const { code, map, segment } = transformedModule[0];
      return { code, map, meta: { segment } };
    }

    debug(`load(${count})`, 'Not a QRL or virtual module', id);
    return null;
  };

  let transformCount = 0;
  const transform = async function (
    ctx: Rollup.PluginContext,
    code: string,
    id: string,
    transformOpts: Parameters<Extract<Plugin['transform'], Function>>[2] = {}
  ): Promise<TransformResult> {
    if (id.startsWith('\0')) {
      return;
    }
    const count = transformCount++;
    const isServer = getIsServer(transformOpts);
    const currentOutputs = isServer ? serverTransformedOutputs : clientTransformedOutputs;
    if (currentOutputs.has(id)) {
      // This is a QRL segment, and we don't need to process it any further
      return;
    }

    const optimizer = getOptimizer();
    const path = getPath();

    const { pathId } = parseId(id);
    const parsedPathId = path.parse(pathId);
    const dir = parsedPathId.dir;
    const base = parsedPathId.base;
    const ext = parsedPathId.ext.toLowerCase();
    if (ext in TRANSFORM_EXTS || TRANSFORM_REGEX.test(pathId)) {
      /** Strip client|server code from unisynth server|client, but not in lib/test */
      const strip = opts.target === 'client' || opts.target === 'ssr';
      debug(
        `transform(${count})`,
        `Transforming ${id} (for: ${isServer ? 'server' : 'client'}${strip ? ', strip' : ''})`
      );

      const mode =
        opts.target === 'lib' ? 'lib' : opts.buildMode === 'development' ? 'dev' : 'prod';

      if (mode !== 'lib') {
        // this messes a bit with the source map, but it's ok for if statements
        code = code.replaceAll(/__EXPERIMENTAL__\.(\w+)/g, (_, feature) => {
          if (opts.experimental?.[feature as ExperimentalFeatures]) {
            return 'true';
          }
          return 'false';
        });
      }

      let filePath = base;
      if (opts.srcDir) {
        filePath = path.relative(opts.srcDir, pathId);
      }
      filePath = normalizePath(filePath);
      const srcDir = opts.srcDir ? opts.srcDir : normalizePath(dir);
      const entryStrategy: EntryStrategy = opts.entryStrategy;
      let devPath: string | undefined;
      if (devServer) {
        devPath = devServer.moduleGraph.getModuleById(pathId)?.url;
      }
      const transformOpts: TransformModulesOptions = {
        input: [{ code, path: filePath, devPath }],
        entryStrategy: isServer ? { type: 'hoist' } : entryStrategy,
        minify: 'simplify',
        // Always enable sourcemaps in dev for click-to-source
        sourceMaps: opts.sourcemap || 'development' === opts.buildMode,
        transpileTs: true,
        transpileJsx: true,
        explicitExtensions: true,
        preserveFilenames: true,
        srcDir,
        rootDir: opts.rootDir,
        mode,
        scope: opts.scope || undefined,
        isServer,
      };

      if (strip) {
        if (isServer) {
          transformOpts.stripCtxName = CLIENT_STRIP_CTX_NAME;
          transformOpts.stripEventHandlers = true;
          transformOpts.regCtxName = REG_CTX_NAME;
        } else {
          transformOpts.stripCtxName = SERVER_STRIP_CTX_NAME;
          transformOpts.stripExports = SERVER_STRIP_EXPORTS;
        }
      }

      // TODO use a worker pool or make this async
      const newOutput = optimizer.transformModulesSync(transformOpts);
      const module = newOutput.modules.find((mod) => !isAdditionalFile(mod))!;

      // uncomment to show transform results
      // debug({ isServer, strip }, transformOpts, newOutput);
      diagnosticsCallback(newOutput.diagnostics, optimizer, srcDir);

      if (isServer) {
        if (newOutput.diagnostics.length === 0 && linter) {
          linter.lint(ctx, code, id);
        }
      } else {
        clientResults.set(id, newOutput);
      }
      const deps = new Set<string>();
      for (const mod of newOutput.modules) {
        if (mod !== module) {
          const key = normalizePath(path.join(srcDir, mod.path));
          debug(`transform(${count})`, `segment ${key}`, mod.segment!.displayName);
          parentIds.set(key, id);
          currentOutputs.set(key, [mod, id]);
          deps.add(key);
          if (opts.target === 'client') {
            if (devServer) {
              // invalidate the segment so that the client will pick it up
              const rollupModule = devServer.moduleGraph.getModuleById(key);
              if (rollupModule) {
                devServer.moduleGraph.invalidateModule(rollupModule);
              }
            } else {
              // rollup must be told about all entry points
              ctx.emitFile({
                id: key,
                type: 'chunk',
                preserveSignature: 'allow-extension',
              });
            }
          }
        }
      }

      // Force loading generated submodules into Rollup cache so later
      // unchanged imports are not missing in our internal transform cache
      // This can happen in the repl when the plugin is re-initialized
      // and possibly in other places
      for (const id of deps.values()) {
        await ctx.load({ id });
      }

      ctx.addWatchFile(id);

      return {
        code: module.code,
        map: module.map,
        meta: {
          segment: module.segment,
          unisynthdeps: Array.from(deps),
        },
      };
    }

    debug(`transform(${count})`, 'Not transforming', id);

    return null;
  };

  const createOutputAnalyzer = (rollupBundle: OutputBundle) => {
    const injections: GlobalInjections[] = [];

    const addInjection = (b: GlobalInjections) => injections.push(b);
    const generateManifest = async () => {
      const optimizer = getOptimizer();
      const path = optimizer.sys.path;

      const segments = Array.from(clientResults.values())
        .flatMap((r) => r.modules)
        .map((mod) => mod.segment)
        .filter((h) => !!h) as SegmentAnalysis[];

      const manifest = generateManifestFromBundles(
        path,
        segments,
        injections,
        rollupBundle,
        opts,
        debug
      );

      for (const symbol of Object.values(manifest.symbols)) {
        if (symbol.origin) {
          symbol.origin = normalizePath(symbol.origin);
        }
      }

      for (const bundle of Object.values(manifest.bundles)) {
        if (bundle.origins) {
          bundle.origins = bundle.origins
            .map((abs) => {
              const relPath = path.relative(opts.rootDir, abs);
              return normalizePath(relPath);
            })
            .sort();
        }
      }

      manifest.manifestHash = hashCode(JSON.stringify(manifest));

      return manifest;
    };

    return { addInjection, generateManifest };
  };

  const getOptions = () => opts;

  const getTransformedOutputs = () => {
    return Array.from(clientTransformedOutputs.values()).map((t) => {
      return t[0];
    });
  };

  const debug = (...str: any[]) => {
    if (opts.debug) {
      // eslint-disable-next-line no-console
      console.debug(`[UNISYNTH PLUGIN: ${id}]`, ...str);
    }
  };

  const log = (...str: any[]) => {
    // eslint-disable-next-line no-console
    console.log(`[UNISYNTH PLUGIN: ${id}]`, ...str);
  };

  const onDiagnostics = (cb: (d: Diagnostic[], optimizer: Optimizer, srcDir: string) => void) => {
    diagnosticsCallback = cb;
  };

  const normalizePath = (id: string) => lazyNormalizePath(id);

  function getUnisynthBuildModule(isServer: boolean, _target: UnisynthBuildTarget) {
    const isDev = opts.buildMode === 'development';
    return `// @khulnasoft.com/unisynth/build
export const isServer = ${JSON.stringify(isServer)};
export const isBrowser = ${JSON.stringify(!isServer)};
export const isDev = ${JSON.stringify(isDev)};
`;
  }

  async function getUnisynthServerManifestModule(isServer: boolean) {
    const manifest = isServer ? opts.manifestInput : null;
    return `// @unisynth-client-manifest
export const manifest = ${JSON.stringify(manifest)};\n`;
  }

  function setSourceMapSupport(sourcemap: boolean) {
    opts.sourcemap = sourcemap;
  }

  // Only used in Vite dev mode
  function handleHotUpdate(ctx: HmrContext) {
    debug('handleHotUpdate()', ctx.file);

    for (const mod of ctx.modules) {
      const { id } = mod;
      if (id) {
        debug('handleHotUpdate()', `invalidate ${id}`);
        clientResults.delete(id);
        for (const outputs of [clientTransformedOutputs, serverTransformedOutputs]) {
          for (const [key, [_, parentId]] of outputs) {
            if (parentId === id) {
              debug('handleHotUpdate()', `invalidate ${id} segment ${key}`);
              outputs.delete(key);
              const mod = ctx.server.moduleGraph.getModuleById(key);
              if (mod) {
                ctx.server.moduleGraph.invalidateModule(mod);
              }
            }
          }
        }
      }
    }
  }

  // This groups all QRL segments into their respective entry points
  // optimization opportunity: group small segments that don't import anything into smallish chunks
  // order by discovery time, so that related segments are more likely to group together
  function manualChunks(id: string, { getModuleInfo }: Rollup.ManualChunkMeta) {
    const module = getModuleInfo(id)!;
    const segment = module.meta.segment as SegmentAnalysis | undefined;
    return segment?.entry;
  }

  return {
    buildStart,
    createOutputAnalyzer,
    getUnisynthBuildModule,
    getOptimizer,
    getOptions,
    getPath,
    getSys,
    getTransformedOutputs,
    init,
    load,
    debug,
    log,
    normalizeOptions,
    normalizePath,
    onDiagnostics,
    resolveId,
    transform,
    validateSource,
    setSourceMapSupport,
    configureServer,
    handleHotUpdate,
    manualChunks,
  };
}

/** Convert windows backslashes to forward slashes */
export const makeNormalizePath = (sys: OptimizerSystem) => (id: string) => {
  if (typeof id === 'string') {
    if (isWin(sys.os)) {
      // MIT https://github.com/sindresorhus/slash/blob/main/license
      // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
      const isExtendedLengthPath = /^\\\\\?\\/.test(id);
      if (!isExtendedLengthPath) {
        const hasNonAscii = /[^\u0000-\u0080]+/.test(id); // eslint-disable-line no-control-regex
        if (!hasNonAscii) {
          id = id.replace(/\\/g, '/');
        }
      }
      // windows normalize
      return sys.path.posix.normalize(id);
    }
    // posix normalize
    return sys.path.normalize(id);
  }
  return id;
};

function isAdditionalFile(mod: TransformModule) {
  return mod.isEntry || mod.segment;
}

export function parseId(originalId: string) {
  const [pathId, query] = originalId.split('?');
  const queryStr = query || '';
  return {
    originalId,
    pathId,
    query: queryStr ? `?${query}` : '',
    params: new URLSearchParams(queryStr),
  };
}

export const getSymbolHash = (symbolName: string) =>
  /_([a-z0-9]+)($|\.js($|\?))/.exec(symbolName)?.[1];

const TRANSFORM_EXTS = {
  '.jsx': true,
  '.ts': true,
  '.tsx': true,
} as const;

/**
 * Any file that matches this needs to be processed by Unisynth to extract QRL segments etc. Used in
 * libraries.
 *
 * @internal
 */
export const TRANSFORM_REGEX = /\.unisynth\.[mc]?js$/;

export const UNISYNTH_CORE_ID = '@khulnasoft.com/unisynth';

export const UNISYNTH_BUILD_ID = '@khulnasoft.com/unisynth/build';

export const UNISYNTH_JSX_RUNTIME_ID = '@khulnasoft.com/unisynth/jsx-runtime';

export const UNISYNTH_JSX_DEV_RUNTIME_ID = '@khulnasoft.com/unisynth/jsx-dev-runtime';

export const UNISYNTH_CORE_SERVER = '@khulnasoft.com/unisynth/server';

export const UNISYNTH_CLIENT_MANIFEST_ID = '@unisynth-client-manifest';

export const SRC_DIR_DEFAULT = 'src';

export const CLIENT_OUT_DIR = 'dist';

export const SSR_OUT_DIR = 'server';

const LIB_OUT_DIR = 'lib';

export const Q_MANIFEST_FILENAME = 'q-manifest.json';

export interface UnisynthPluginDevTools {
  imageDevTools?: boolean | true;
  clickToSource?: string[] | false;
}

export interface UnisynthPluginOptions {
  csr?: boolean;
  buildMode?: UnisynthBuildMode;
  debug?: boolean;
  entryStrategy?: EntryStrategy;
  rootDir?: string;
  tsconfigFileNames?: string[];
  /** @deprecated No longer used */
  vendorRoots?: string[];
  manifestOutput?: ((manifest: UnisynthManifest) => Promise<void> | void) | null;
  manifestInput?: UnisynthManifest | null;
  insightsManifest?: InsightManifest | null;
  input?: string[] | string | { [entry: string]: string };
  outDir?: string;
  assetsDir?: string;
  srcDir?: string | null;
  scope?: string | null;
  srcInputs?: TransformModuleInput[] | null;
  sourcemap?: boolean;
  resolveUnisynthBuild?: boolean;
  target?: UnisynthBuildTarget;
  transformedModuleOutput?:
    | ((transformedModules: TransformModule[]) => Promise<void> | void)
    | null;
  devTools?: UnisynthPluginDevTools;
  /**
   * Inline styles up to a certain size (in bytes) instead of using a separate file.
   *
   * Default: 20kb (20,000bytes)
   */
  inlineStylesUpToBytes?: number;
  /**
   * Run eslint on the source files for the ssr build or dev server. This can slow down startup on
   * large projects. Defaults to `true`
   */
  lint?: boolean;
  /**
   * Experimental features. These can come and go in patch releases, and their API is not guaranteed
   * to be stable between releases.
   */
  experimental?: (keyof typeof ExperimentalFeatures)[];
}

export interface NormalizedUnisynthPluginOptions
  extends Omit<Required<UnisynthPluginOptions>, 'vendorRoots' | 'experimental'> {
  input: string[] | { [entry: string]: string };
  experimental?: Record<keyof typeof ExperimentalFeatures, boolean>;
}

/** @public */
export type UnisynthBuildTarget = 'client' | 'ssr' | 'lib' | 'test';

/** @public */
export type UnisynthBuildMode = 'production' | 'development';
