import { renderToStream, type RenderToStreamOptions } from '@khulnasoft.com/unisynth/server';
import { manifest } from '@unisynth-client-manifest';
import Root from './root';

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    unisynthLoader: {
      // The docs can be long so make sure to intercept events before the end of the document.
      position: 'top',
    },
    ...opts,
    containerAttributes: {
      lang: 'en',
      ...opts.containerAttributes,
    },
    // Core Web Vitals experiment until November 8: Do not remove! Reach out to @maiieul first if you believe you have a good reason to change this.
    prefetchStrategy: {
      implementation: {
        linkInsert: 'html-append',
        linkRel: 'modulepreload',
      },
    },
    // Core Web Vitals experiment until November 8: Do not remove! Reach out to @maiieul first if you believe you have a good reason to change this.
    unisynthPrefetchServiceWorker: {
      include: false,
    },
  });
}
