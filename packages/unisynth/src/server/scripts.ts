const UNISYNTH_LOADER_DEFAULT_MINIFIED: string = (globalThis as any)
  .UNISYNTH_LOADER_DEFAULT_MINIFIED;
const UNISYNTH_LOADER_DEFAULT_DEBUG: string = (globalThis as any).UNISYNTH_LOADER_DEFAULT_DEBUG;

/**
 * Provides the `unisynthloader.js` file as a string. Useful for tooling to inline the
 * unisynthloader script into HTML.
 *
 * @public
 */
export function getUnisynthLoaderScript(opts: { debug?: boolean } = {}) {
  // default script selector behavior
  return opts.debug ? UNISYNTH_LOADER_DEFAULT_DEBUG : UNISYNTH_LOADER_DEFAULT_MINIFIED;
}

const UNISYNTH_PREFETCH_MINIFIED: string = (globalThis as any).UNISYNTH_PREFETCH_MINIFIED;
const UNISYNTH_PREFETCH_DEBUG: string = (globalThis as any).UNISYNTH_PREFETCH_DEBUG;

/**
 * Provides the `unisynth-prefetch-service-worker.js` file as a string. Useful for tooling to inline
 * the unisynth-prefetch-service-worker script into HTML.
 *
 * @public
 */
export function getUnisynthPrefetchWorkerScript(opts: { debug?: boolean } = {}) {
  return opts.debug ? UNISYNTH_PREFETCH_DEBUG : UNISYNTH_PREFETCH_MINIFIED;
}
