/* eslint-disable no-var */
// Globals used by unisynth, for internal use only

type ExperimentalFeatures = import('./src/optimizer/src/plugins/plugin').ExperimentalFeatures;

declare var __EXPERIMENTAL__: {
  [K in ExperimentalFeatures]: boolean;
};
