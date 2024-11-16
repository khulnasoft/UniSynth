import type { Plugin } from 'rollup';
import type { UnisynthRollupPluginOptions } from '@khulnasoft.com/unisynth/optimizer';
import type { UnisynthWorkerGlobal } from './repl-service-worker';
import type { MinifyOptions } from 'terser';
import type { ReplInputOptions } from '../types';
import { depResponse } from './repl-dependencies';

export const replResolver = (options: ReplInputOptions, buildMode: 'client' | 'ssr'): Plugin => {
  const srcInputs = options.srcInputs;
  const resolveId = (id: string) => {
    return srcInputs.find((i) => i.path === id)?.path;
  };

  return {
    name: 'repl-resolver',

    resolveId(id, importer) {
      // Entry point
      if (!importer) {
        return id;
      }
      if (
        id === '@khulnasoft.com/unisynth' ||
        id === '@khulnasoft.com/unisynth/jsx-runtime' ||
        id === '@khulnasoft.com/unisynth/jsx-dev-runtime'
      ) {
        return '\0unisynthCore';
      }
      if (id === '@khulnasoft.com/unisynth/server') {
        return '\0unisynthServer';
      }
      // Simple relative file resolution
      if (id.startsWith('./')) {
        const extensions = ['', '.tsx', '.ts'];
        id = id.slice(1);
        for (const ext of extensions) {
          const path = resolveId(id + ext);
          if (path) {
            return path;
          }
        }
      }
    },

    async load(id) {
      const input = options.srcInputs.find((i) => i.path === id);
      if (input && typeof input.code === 'string') {
        return input.code;
      }
      if (buildMode === 'ssr') {
        if (id === '\0unisynthCore') {
          return getRuntimeBundle('unisynthCore');
        }
        if (id === '\0unisynthServer') {
          return getRuntimeBundle('unisynthServer');
        }
      }
      if (id === '\0unisynthCore') {
        if (options.buildMode === 'production') {
          const rsp = await depResponse('@khulnasoft.com/unisynth', '/core.min.mjs');
          if (rsp) {
            return rsp.text();
          }
        }

        const rsp = await depResponse('@khulnasoft.com/unisynth', '/core.mjs');
        if (rsp) {
          return rsp.text();
        }
        throw new Error(`Unable to load Unisynth core`);
      }

      // We're the fallback, we know all the files
      if (/\.[jt]sx?$/.test(id)) {
        throw new Error(`load: unknown module ${id}`);
      }
    },
  };
};

const getRuntimeBundle = (runtimeBundle: string) => {
  const runtimeApi = (self as any)[runtimeBundle];
  if (!runtimeApi) {
    throw new Error(`Unable to load Unisynth runtime bundle "${runtimeBundle}"`);
  }

  const exportKeys = Object.keys(runtimeApi);
  const code = `
    const { ${exportKeys.join(', ')} } = self.${runtimeBundle};
    export { ${exportKeys.join(', ')} };
  `;
  return code;
};

export const replCss = (options: ReplInputOptions): Plugin => {
  const isStylesheet = (id: string) =>
    ['.css', '.scss', '.sass', '.less', '.styl', '.stylus'].some((ext) =>
      id.endsWith(`${ext}?inline`)
    );

  return {
    name: 'repl-css',

    resolveId(id) {
      if (isStylesheet(id)) {
        return id.startsWith('.') ? id.slice(1) : id;
      }
      return null;
    },

    load(id) {
      if (isStylesheet(id)) {
        const input = options.srcInputs.find((i) => i.path.endsWith(id.replace(/\?inline$/, '')));
        if (input && typeof input.code === 'string') {
          return `const css = ${JSON.stringify(input.code)}; export default css;`;
        }
      }
      return null;
    },
  };
};

export const replMinify = (unisynthRollupPluginOpts: UnisynthRollupPluginOptions): Plugin => {
  return {
    name: 'repl-minify',

    async generateBundle(_, bundle) {
      if (unisynthRollupPluginOpts.buildMode === 'production') {
        for (const fileName in bundle) {
          const chunk = bundle[fileName];
          if (chunk.type === 'chunk') {
            const result = await self.Terser?.minify(chunk.code, TERSER_OPTIONS);
            if (result) {
              chunk.code = result.code!;
            }
          }
        }
      }
    },
  };
};

const TERSER_OPTIONS: MinifyOptions = {
  ecma: 2020,
  module: true,
  toplevel: true,
};

declare const self: UnisynthWorkerGlobal;
