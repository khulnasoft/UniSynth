import { build, type Plugin, transform } from 'esbuild';
import { execa } from 'execa';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { rollup } from 'rollup';
import { type BuildConfig, emptyDir, importPath, nodeTarget, panic } from './util';

export async function buildUnisynthCity(config: BuildConfig) {
  if (!config.dev) {
    emptyDir(config.distUnisynthCityPkgDir);
  }

  await Promise.all([
    buildServiceWorker(config),
    buildVite(config),
    buildAdapterAzureSwaVite(config),
    buildAdapterCloudflarePagesVite(config),
    buildAdapterCloudRunVite(config),
    buildAdapterDenoVite(config),
    buildAdapterBunVite(config),
    buildAdapterNodeServerVite(config),
    buildAdapterNetlifyEdgeVite(config),
    buildAdapterSharedVite(config),
    buildAdapterStaticVite(config),
    buildAdapterVercelEdgeVite(config),
    buildMiddlewareCloudflarePages(config),
    buildMiddlewareNetlifyEdge(config),
    buildMiddlewareAzureSwa(config),
    buildMiddlewareAwsLambda(config),
    buildMiddlewareDeno(config),
    buildMiddlewareBun(config),
    buildMiddlewareNode(config),
    buildMiddlewareRequestHandler(config),
    buildMiddlewareVercelEdge(config),
    buildMiddlewareFirebase(config),
    buildStatic(config),
    buildStaticNode(config),
    buildStaticDeno(config),
  ]);

  await buildRuntime(config);

  console.log(`🏙  unisynth-city`);
}

async function buildRuntime(config: BuildConfig) {
  const execOptions = {
    win: {
      manager: 'npm',
      command: ['run', 'build'],
    },
    other: {
      manager: 'pnpm',
      command: ['build'],
    },
  };
  const isWindows = process.platform.includes('win32');
  const runOptions = isWindows ? execOptions.win : execOptions.other;

  const result = await execa(runOptions.manager, runOptions.command, {
    stdout: 'inherit',
    cwd: config.srcUnisynthCityDir,
  });
  if (result.failed) {
    panic(`tsc failed`);
  }
}

async function buildVite(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'buildtime', 'vite', 'index.ts')];

  const external = [
    'fs',
    'path',
    'url',
    'vite',
    'source-map',
    'vfile',
    '@mdx-js/mdx',
    'node-fetch',
    'undici',
    'typescript',
    'vite-imagetools',
    'svgo',
  ];

  const swRegisterPath = join(config.srcUnisynthCityDir, 'runtime', 'src', 'sw-register.ts');
  let swRegisterCode = await readFile(swRegisterPath, 'utf-8');

  const swResult = await transform(swRegisterCode, { loader: 'ts', minify: true });
  swRegisterCode = swResult.code.trim();
  if (swRegisterCode.endsWith(';')) {
    swRegisterCode = swRegisterCode.slice(0, swRegisterCode.length - 1);
  }

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external,
    alias: {
      '@khulnasoft.com/unisynth': 'noop',
      '@khulnasoft.com/unisynth/optimizer': 'noop',
    },
    plugins: [serviceWorkerRegisterBuild(swRegisterCode)],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external,
    plugins: [serviceWorkerRegisterBuild(swRegisterCode)],
  });
}

function serviceWorkerRegisterBuild(swRegisterCode: string) {
  const filter = /\@unisynth-city-sw-register-build/;

  const plugin: Plugin = {
    name: 'serviceWorkerRegisterBuild',
    setup(build) {
      build.onResolve({ filter }, (args) => ({
        path: args.path,
        namespace: 'sw-reg',
      }));
      build.onLoad({ filter: /.*/, namespace: 'sw-reg' }, () => ({
        contents: swRegisterCode,
        loader: 'text',
      }));
    },
  };
  return plugin;
}

async function buildServiceWorker(config: BuildConfig) {
  const build = await rollup({
    input: join(
      config.tscDir,
      'packages',
      'unisynth-city',
      'src',
      'runtime',
      'src',
      'service-worker',
      'index.js'
    ),
  });

  await build.write({
    file: join(config.distUnisynthCityPkgDir, 'service-worker.mjs'),
    format: 'es',
  });

  await build.write({
    file: join(config.distUnisynthCityPkgDir, 'service-worker.cjs'),
    format: 'cjs',
  });
}

async function buildAdapterAzureSwaVite(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'adapters', 'azure-swa', 'vite', 'index.ts')];

  const external = ['vite', 'fs', 'path', '@khulnasoft.com/unisynth-city/static'];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'azure-swa', 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external,
    plugins: [resolveAdapterShared('../../shared/vite/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'azure-swa', 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external,
    plugins: [resolveAdapterShared('../../shared/vite/index.cjs')],
  });
}

async function buildAdapterCloudflarePagesVite(config: BuildConfig) {
  const entryPoints = [
    join(config.srcUnisynthCityDir, 'adapters', 'cloudflare-pages', 'vite', 'index.ts'),
  ];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'cloudflare-pages', 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'cloudflare-pages', 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.cjs')],
  });
}

async function buildAdapterCloudRunVite(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'adapters', 'cloud-run', 'vite', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'cloud-run', 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'cloud-run', 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.cjs')],
  });
}

async function buildAdapterBunVite(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'adapters', 'bun-server', 'vite', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'bun-server', 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'bun-server', 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external: ADAPTER_EXTERNALS,
    plugins: [
      resolveAdapterShared('../../shared/vite/index.cjs'),
      resolveRequestHandler('../../../middleware/request-handler/index.cjs'),
    ],
  });
}

async function buildAdapterDenoVite(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'adapters', 'deno-server', 'vite', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'deno-server', 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'deno-server', 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external: ADAPTER_EXTERNALS,
    plugins: [
      resolveAdapterShared('../../shared/vite/index.cjs'),
      resolveRequestHandler('../../../middleware/request-handler/index.cjs'),
    ],
  });
}

async function buildAdapterNodeServerVite(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'adapters', 'node-server', 'vite', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'node-server', 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'node-server', 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.cjs')],
  });
}

async function buildAdapterNetlifyEdgeVite(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'adapters', 'netlify-edge', 'vite', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'netlify-edge', 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'netlify-edge', 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external: ADAPTER_EXTERNALS,
    plugins: [
      resolveAdapterShared('../../shared/vite/index.cjs'),
      resolveRequestHandler('../../../middleware/request-handler/index.cjs'),
    ],
  });
}

async function buildAdapterSharedVite(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'adapters', 'shared', 'vite', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'shared', 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: ADAPTER_EXTERNALS,
    plugins: [
      resolveStatic('../../../static/index.mjs'),
      resolveRequestHandler('../../../middleware/request-handler/index.mjs'),
    ],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'shared', 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external: ADAPTER_EXTERNALS,
    plugins: [
      resolveStatic('../../../static/index.cjs'),
      resolveRequestHandler('../../../middleware/request-handler/index.cjs'),
    ],
  });
}

async function buildAdapterStaticVite(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'adapters', 'static', 'vite', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'static', 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveStatic('../../../static/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'static', 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveStatic('../../../static/index.cjs')],
  });
}

async function buildAdapterVercelEdgeVite(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'adapters', 'vercel-edge', 'vite', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'vercel-edge', 'vite', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'adapters', 'vercel-edge', 'vite', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external: ADAPTER_EXTERNALS,
    plugins: [resolveAdapterShared('../../shared/vite/index.cjs')],
  });
}

async function buildMiddlewareAzureSwa(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'middleware', 'azure-swa', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'azure-swa', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: MIDDLEWARE_EXTERNALS,
    plugins: [resolveRequestHandler('../request-handler/index.mjs')],
  });
}

async function buildMiddlewareAwsLambda(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'middleware', 'aws-lambda', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'aws-lambda', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: MIDDLEWARE_EXTERNALS,
    plugins: [resolveRequestHandler('../request-handler/index.mjs')],
  });
}

async function buildMiddlewareCloudflarePages(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'middleware', 'cloudflare-pages', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'cloudflare-pages', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: MIDDLEWARE_EXTERNALS,
    plugins: [resolveRequestHandler('../request-handler/index.mjs')],
  });
}

async function buildMiddlewareBun(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'middleware', 'bun', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'bun', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: MIDDLEWARE_EXTERNALS,
    plugins: [resolveRequestHandler('../request-handler/index.mjs')],
  });
}

async function buildMiddlewareDeno(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'middleware', 'deno', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'deno', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: MIDDLEWARE_EXTERNALS,
    plugins: [resolveRequestHandler('../request-handler/index.mjs')],
  });
}

async function buildMiddlewareNetlifyEdge(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'middleware', 'netlify-edge', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'netlify-edge', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: MIDDLEWARE_EXTERNALS,
    plugins: [resolveRequestHandler('../request-handler/index.mjs')],
  });
}

async function buildMiddlewareNode(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'middleware', 'node', 'index.ts')];

  const external = ['node-fetch', 'undici', 'path', 'os', 'fs', 'url', ...MIDDLEWARE_EXTERNALS];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'node', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external,
    plugins: [resolveRequestHandler('../request-handler/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'node', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external,
    plugins: [resolveRequestHandler('../request-handler/index.cjs')],
  });
}

async function buildMiddlewareRequestHandler(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'middleware', 'request-handler', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'request-handler', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: MIDDLEWARE_EXTERNALS,
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'request-handler', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external: MIDDLEWARE_EXTERNALS,
  });
}

async function buildMiddlewareVercelEdge(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'middleware', 'vercel-edge', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'vercel-edge', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: MIDDLEWARE_EXTERNALS,
    plugins: [resolveRequestHandler('../request-handler/index.mjs')],
  });
}

async function buildMiddlewareFirebase(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'middleware', 'firebase', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'middleware', 'firebase', 'index.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external: MIDDLEWARE_EXTERNALS,
    plugins: [resolveRequestHandler('../request-handler/index.mjs')],
  });
}

async function buildStatic(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'static', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'static', 'index.mjs'),
    bundle: true,
    platform: 'neutral',
    format: 'esm',
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'static', 'index.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
  });
}

async function buildStaticDeno(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'static', 'deno', 'index.ts')];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'static', 'deno.mjs'),
    bundle: true,
    platform: 'neutral',
    format: 'esm',
    plugins: [resolveRequestHandler('../middleware/request-handler/index.mjs')],
  });
}

async function buildStaticNode(config: BuildConfig) {
  const entryPoints = [join(config.srcUnisynthCityDir, 'static', 'node', 'index.ts')];

  const external = [
    '@khulnasoft.com/unisynth',
    '@khulnasoft.com/unisynth/optimizer',
    '@khulnasoft.com/unisynth-city',
    'fs',
    'http',
    'https',
    'node-fetch',
    'undici',
    'os',
    'path',
    'stream/web',
    'url',
    'worker_threads',
    'vite',
  ];

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'static', 'node.mjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'esm',
    external,
    plugins: [resolveRequestHandler('../middleware/request-handler/index.mjs')],
  });

  await build({
    entryPoints,
    outfile: join(config.distUnisynthCityPkgDir, 'static', 'node.cjs'),
    bundle: true,
    platform: 'node',
    target: nodeTarget,
    format: 'cjs',
    external,
    plugins: [resolveRequestHandler('../middleware/request-handler/index.cjs')],
  });
}

function resolveRequestHandler(path: string) {
  return importPath(/middleware\/request-handler/, path);
}

function resolveStatic(path: string) {
  return importPath(/static$/, path);
}

function resolveAdapterShared(path: string) {
  return importPath(/shared\/vite$/, path);
}

const ADAPTER_EXTERNALS = [
  'vite',
  'fs',
  'path',
  '@khulnasoft.com/unisynth',
  '@khulnasoft.com/unisynth/server',
  '@khulnasoft.com/unisynth/optimizer',
  '@khulnasoft.com/unisynth-city',
  '@khulnasoft.com/unisynth-city/static',
  '@khulnasoft.com/unisynth-city/middleware/request-handler',
];

const MIDDLEWARE_EXTERNALS = [
  '@khulnasoft.com/unisynth',
  '@khulnasoft.com/unisynth/optimizer',
  '@khulnasoft.com/unisynth/server',
  '@khulnasoft.com/unisynth-city',
  '@khulnasoft.com/unisynth-city/static',
  '@unisynth-city-plan',
  '@unisynth-city-not-found-paths',
  '@unisynth-city-static-paths',
];
