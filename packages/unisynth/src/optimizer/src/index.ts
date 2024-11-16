export { createOptimizer } from './optimizer';
export { versions } from './versions';

export type {
  ComponentEntryStrategy,
  Diagnostic,
  DiagnosticCategory,
  EntryStrategy,
  GlobalInjections,
  SegmentAnalysis as HookAnalysis,
  SegmentAnalysis,
  SegmentEntryStrategy as HookEntryStrategy,
  SegmentEntryStrategy,
  InlineEntryStrategy,
  InsightManifest,
  MinifyMode,
  Optimizer,
  OptimizerOptions,
  OptimizerSystem,
  Path,
  UnisynthBundle,
  UnisynthManifest,
  UnisynthSymbol,
  ResolvedManifest,
  SingleEntryStrategy,
  SmartEntryStrategy,
  SourceLocation,
  SourceMapsOption,
  SymbolMapper,
  SymbolMapperFn,
  SystemEnvironment,
  TransformFsOptions,
  TransformModule,
  TransformModuleInput,
  TransformModulesOptions,
  TransformOptions,
  TransformOutput,
  TranspileOption,
} from './types';

export type {
  UnisynthBuildMode,
  UnisynthBuildTarget,
  ExperimentalFeatures,
} from './plugins/plugin';
export type { UnisynthRollupPluginOptions } from './plugins/rollup';
export type {
  UnisynthViteDevResponse,
  UnisynthVitePlugin,
  UnisynthVitePluginApi,
  UnisynthVitePluginOptions,
} from './plugins/vite';

export { unisynthRollup } from './plugins/rollup';
export { unisynthVite } from './plugins/vite';
export { symbolMapper } from './plugins/vite-dev-server';
