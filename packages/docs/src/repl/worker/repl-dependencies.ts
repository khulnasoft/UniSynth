/* eslint-disable no-console */
import type { ReplInputOptions } from '../types';
import { UNISYNTH_PKG_NAME, UNISYNTH_REPL_DEPS_CACHE } from './repl-constants';
import type { UnisynthWorkerGlobal } from './repl-service-worker';

let options: ReplInputOptions;
let cache: Cache;

export const depResponse = async (pkgName: string, pkgPath: string) => {
  if (pkgName === UNISYNTH_PKG_NAME && !pkgPath.startsWith('/bindings')) {
    const version = options.deps[pkgName].version;
    const [M, m, p] = version.split('-')[0].split('.').map(Number);
    if (M > 1 || (M == 1 && (m > 7 || (m == 7 && p >= 2)))) {
      pkgPath = `/dist${pkgPath}`;
    }
  }
  const url = options.deps[pkgName][pkgPath];
  if (!url) {
    throw new Error(`No URL given for dep: ${pkgName}${pkgPath}`);
  }
  const req = new Request(url);
  const cachedRes = await cache.match(req);
  if (cachedRes) {
    return cachedRes;
  }
  const fetchRes = await fetch(req);
  if (fetchRes.ok) {
    if (/^(http|\/)/.test(req.url) && !req.url.includes('localhost')) {
      await cache.put(req, fetchRes.clone());
    }
    return fetchRes;
  }
  throw new Error('Failed to fetch: ' + req.url);
};

const exec = async (pkgName: string, pkgPath: string) => {
  const res = await depResponse(pkgName, pkgPath);
  console.debug(`Run: ${pkgName}${pkgPath} ${res.url}`);
  // eslint-disable-next-line no-new-func
  const run = new Function(await res.text());
  run();
};

const _loadDependencies = async (replOptions: ReplInputOptions) => {
  options = replOptions;
  const unisynthVersion = options.version;
  const realUnisynthVersion = options.deps[UNISYNTH_PKG_NAME].version;

  cache = await caches.open(UNISYNTH_REPL_DEPS_CACHE);

  self.unisynthBuild = {
    isServer: true,
    isBrowser: false,
    isDev: false,
  };

  const cachedCjsCode = `unisynthWasmCjs${realUnisynthVersion}`;
  const cachedWasmRsp = `unisynthWasmRsp${realUnisynthVersion}`;

  // Store the optimizer where platform.ts can find it
  let cjsCode: string = (globalThis as any)[cachedCjsCode];
  let wasmRsp: Response = (globalThis as any)[cachedWasmRsp];
  if (!cjsCode || !wasmRsp) {
    const cjsRes = await depResponse(UNISYNTH_PKG_NAME, '/bindings/unisynth.wasm.cjs');
    cjsCode = await cjsRes.text();
    (globalThis as any)[cachedCjsCode] = cjsCode;
    const res = await depResponse(UNISYNTH_PKG_NAME, '/bindings/unisynth_wasm_bg.wasm');
    wasmRsp = res;
    (globalThis as any)[cachedWasmRsp] = wasmRsp;
    console.debug(`Loaded Unisynth WASM bindings ${realUnisynthVersion}`);
  }

  if (!isSameUnisynthVersion(self.unisynthCore?.version)) {
    await exec(UNISYNTH_PKG_NAME, '/core.cjs');
    if (self.unisynthCore) {
      console.debug(`Loaded @khulnasoft.com/unisynth: ${self.unisynthCore.version}`);
    } else {
      throw new Error(`Unable to load @khulnasoft.com/unisynth ${unisynthVersion}`);
    }
  }

  if (!isSameUnisynthVersion(self.unisynthOptimizer?.versions.unisynth)) {
    await exec(UNISYNTH_PKG_NAME, '/optimizer.cjs');
    if (self.unisynthOptimizer) {
      console.debug(`Loaded @khulnasoft.com/unisynth/optimizer: ${self.unisynthOptimizer.versions.unisynth}`);
    } else {
      throw new Error(`Unable to load @khulnasoft.com/unisynth/optimizer ${unisynthVersion}`);
    }
  }

  if (!isSameUnisynthVersion(self.unisynthServer?.versions.unisynth)) {
    await exec(UNISYNTH_PKG_NAME, '/server.cjs');
    if (self.unisynthServer) {
      console.debug(`Loaded @khulnasoft.com/unisynth/server: ${self.unisynthServer.versions.unisynth}`);
    } else {
      throw new Error(`Unable to load @khulnasoft.com/unisynth/server ${unisynthVersion}`);
    }
  }

  if (!self.rollup) {
    await exec('rollup', '/dist/rollup.browser.js');
    if (self.rollup) {
      console.debug(`Loaded rollup: ${(self.rollup as any).VERSION}`);
    } else {
      throw new Error(`Unable to load rollup`);
    }
  }

  if (!self.prettier) {
    await exec('prettier', '/standalone.js');
    await exec('prettier', '/plugins/html.js');
    if (self.prettier) {
      console.debug(`Loaded prettier: ${(self.prettier as any)!.version}`);
    } else {
      throw new Error(`Unable to load prettier`);
    }
  }

  if (options.buildMode === 'production' && !self.Terser) {
    await exec('terser', '/dist/bundle.min.js');
    if (self.Terser) {
      console.debug(`Loaded terser`);
    } else {
      throw new Error(`Unable to load terser`);
    }
  }

  // clear out old cache
  // no need to wait
  cache.keys().then((keys) => {
    if (keys.length > 30) {
      for (let i = 0; i < 5; i++) {
        cache.delete(keys[i]);
      }
    }
  });
};

let loadP: Promise<void> | undefined;
let again = false;
export const loadDependencies = (replOptions: ReplInputOptions) => {
  if (loadP) {
    again = true;
  } else {
    loadP = _loadDependencies(replOptions).finally(() => {
      if (again) {
        again = false;
        loadP = undefined;
        return loadDependencies(replOptions);
      }
      loadP = undefined;
    });
  }
  return loadP;
};

const isSameUnisynthVersion = (a: string | undefined) => {
  if (!a || a !== options.deps[UNISYNTH_PKG_NAME].version) {
    return false;
  }
  return true;
};

declare const self: UnisynthWorkerGlobal;
