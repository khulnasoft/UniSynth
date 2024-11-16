import {
  UNISYNTH_REPL_DEPS_CACHE,
  UNISYNTH_REPL_RESULT_CACHE,
} from '../../../repl/worker/repl-constants';
import { receiveMessageFromMain } from '../../../repl/worker/repl-messenger';
import { requestHandler } from '../../../repl/worker/repl-request-handler';

/**
 * REPL Service Worker
 *
 * /repl/repl-sw.js
 */

self.onmessage = receiveMessageFromMain;

self.onfetch = requestHandler;

self.oninstall = (ev) => {
  self.skipWaiting();
  ev.waitUntil(
    Promise.all([caches.open(UNISYNTH_REPL_DEPS_CACHE), caches.open(UNISYNTH_REPL_RESULT_CACHE)])
  );
};

self.onactivate = () => self.clients.claim();

export interface ReplGlobalApi {
  unisynthCore?: typeof import('@khulnasoft.com/unisynth');
  unisynthOptimizer?: typeof import('@khulnasoft.com/unisynth/optimizer');
  unisynthServer?: typeof import('@khulnasoft.com/unisynth/server');
  prettier?: typeof import('prettier');
  prettierPlugins?: any;
  rollup?: typeof import('rollup');
  Terser?: typeof import('terser');
  rollupCache?: any;
}

export interface UnisynthWorkerGlobal extends ReplGlobalApi {
  onmessage: (ev: MessageEvent) => void;
  onfetch: (ev: FetchEvent) => void;
  oninstall: (ev: ExtendableEvent) => void;
  onactivate: () => void;
  skipWaiting: () => void;
  clients: {
    claim: () => void;
  };
}

declare const self: UnisynthWorkerGlobal;
