import { setPlatform } from '@khulnasoft.com/unisynth';
import { createPlatform } from './platform';
import type { ResolvedManifest } from '@khulnasoft.com/unisynth/optimizer';
import { resolveManifest } from './render';
import type { UnisynthManifest } from './types';

export type {
  PrefetchResource,
  PrefetchImplementation,
  PrefetchStrategy,
  RenderToStringOptions,
  RenderToStringResult,
  Render,
  RenderToStream,
  RenderToString,
  RenderOptions,
  RenderResult,
  RenderToStreamOptions,
  SerializeDocumentOptions,
  RenderToStreamResult,
  UnisynthLoaderOptions,
  StreamingOptions,
  InOrderAuto,
  InOrderDisabled,
  InOrderStreaming,
  SymbolsToPrefetch,
} from './types';
export { renderToString, renderToStream, resolveManifest } from './render';
export { versions } from './utils';
export { getUnisynthLoaderScript, getUnisynthPrefetchWorkerScript } from './scripts';

/** @public */
export async function setServerPlatform(manifest: UnisynthManifest | ResolvedManifest | undefined) {
  const platform = createPlatform({ manifest }, resolveManifest(manifest));
  setPlatform(platform);
}
