/* eslint-disable no-var */
// Globals used by unisynth-city, for internal use only

type RequestEventInternal =
  import('./middleware/request-handler/request-event').RequestEventInternal;
type AsyncStore = import('node:async_hooks').AsyncLocalStorage<RequestEventInternal>;

/** @deprecated Remove this in v2 */
declare var UNISYNTH_MANIFEST:
  | import('@khulnasoft.com/unisynth/optimizer').UnisynthManifest
  | undefined
  | null;

declare var qcAsyncRequestStore: AsyncStore | undefined;
declare var _unisynthActionsMap: Map<string, ActionInternal> | undefined;
declare var __unisynthCityNew: boolean | undefined;

type ExperimentalFeatures = import('@khulnasoft.com/unisynth/optimizer').ExperimentalFeatures;

declare var __EXPERIMENTAL__: {
  [K in ExperimentalFeatures]: boolean;
};
