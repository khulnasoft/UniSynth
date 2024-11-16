/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this entry point
 * will be the common one.
 *
 * - Server (express, cloudflare...)
 * - `npm run start`
 * - `npm run preview`
 * - `npm run build`
 */
import { renderToStream, type RenderToStreamOptions } from '@khulnasoft.com/unisynth/server';
import { manifest } from '@unisynth-client-manifest';
import Root from './root';

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      lang: 'en-us',
      ...opts.containerAttributes,
    },
  });
}