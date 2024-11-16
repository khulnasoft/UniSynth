import type { CorePlatform } from '@khulnasoft.com/unisynth';

/** @public */
export interface MockDocument extends Document {}

/** @public */
export interface MockWindow extends Window {
  document: MockDocument;
}

/**
 * Options when creating a mock Unisynth Document object.
 *
 * @public
 */
export interface MockDocumentOptions {
  url?: URL | string;
  html?: string;
}

/**
 * Options when creating a mock Unisynth Window object.
 *
 * @public
 */
export interface MockWindowOptions extends MockDocumentOptions {}

/** @public */
export interface TestPlatform extends CorePlatform {
  flush: () => Promise<void>;
}
