import type {
  ServerRenderOptions,
  ServerRequestEvent,
} from '@khulnasoft.com/unisynth-city/middleware/request-handler';
import {
  mergeHeadersCookies,
  requestHandler,
  _TextEncoderStream_polyfill,
} from '@khulnasoft.com/unisynth-city/middleware/request-handler';
import { getNotFound } from '@unisynth-city-not-found-paths';
import { isStaticPath } from '@unisynth-city-static-paths';
import { _deserializeData, _serializeData, _verifySerializable } from '@khulnasoft.com/unisynth';
import { setServerPlatform } from '@khulnasoft.com/unisynth/server';

// @khulnasoft.com/unisynth-city/middleware/cloudflare-pages

/** @public */
export function createUnisynthCity(opts: UnisynthCityCloudflarePagesOptions) {
  try {
    // https://developers.cloudflare.com/workers/configuration/compatibility-dates/#streams-constructors
    // this will throw if CF compatibility_date < 2022-11-30
    new globalThis.TextEncoderStream();
  } catch (e) {
    // @ts-ignore
    globalThis.TextEncoderStream = _TextEncoderStream_polyfill;
  }
  const unisynthSerializer = {
    _deserializeData,
    _serializeData,
    _verifySerializable,
  };
  if (opts.manifest) {
    setServerPlatform(opts.manifest);
  }
  async function onCloudflarePagesFetch(
    request: PlatformCloudflarePages['request'],
    env: PlatformCloudflarePages['env'] & { ASSETS: { fetch: (req: Request) => Response } },
    ctx: PlatformCloudflarePages['ctx']
  ) {
    try {
      const url = new URL(request.url);

      if (isStaticPath(request.method, url)) {
        // known static path, let cloudflare handle it
        return env.ASSETS.fetch(request);
      }

      // https://developers.cloudflare.com/workers/runtime-apis/cache/
      const useCache =
        url.hostname !== '127.0.0.1' &&
        url.hostname !== 'localhost' &&
        url.port === '' &&
        request.method === 'GET';
      const cacheKey = new Request(url.href, request);
      const cache = useCache ? await caches.open('custom:unisynthcity') : null;
      if (cache) {
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      const serverRequestEv: ServerRequestEvent<Response> = {
        mode: 'server',
        locale: undefined,
        url,
        request,
        env: {
          get(key) {
            return env[key];
          },
        },
        getWritableStream: (status, headers, cookies, resolve) => {
          const { readable, writable } = new TransformStream<Uint8Array>();
          const response = new Response(readable, {
            status,
            headers: mergeHeadersCookies(headers, cookies),
          });
          resolve(response);
          return writable;
        },
        getClientConn: () => {
          return {
            ip: request.headers.get('CF-connecting-ip') || '',
            country: request.headers.get('CF-IPCountry') || '',
          };
        },
        platform: {
          request,
          env,
          ctx,
        },
      };

      // send request to unisynth city request handler
      const handledResponse = await requestHandler(serverRequestEv, opts, unisynthSerializer);
      if (handledResponse) {
        handledResponse.completion.then((v) => {
          if (v) {
            console.error(v);
          }
        });
        const response = await handledResponse.response;
        if (response) {
          if (response.ok && cache && response.headers.has('Cache-Control')) {
            // Store the fetched response as cacheKey
            // Use waitUntil so you can return the response without blocking on
            // writing to cache
            ctx.waitUntil(cache.put(cacheKey, response.clone()));
          }
          return response;
        }
      }

      // unisynth city did not have a route for this request
      // response with 404 for this pathname

      // In the development server, we replace the getNotFound function
      // For static paths, we assign a static "Not Found" message.
      // This ensures consistency between development and production environments for specific URLs.
      const notFoundHtml = isStaticPath(request.method || 'GET', url)
        ? 'Not Found'
        : getNotFound(url.pathname);
      return new Response(notFoundHtml, {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Not-Found': url.pathname },
      });
    } catch (e: any) {
      console.error(e);
      return new Response(String(e || 'Error'), {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Error': 'cloudflare-pages' },
      });
    }
  }

  return onCloudflarePagesFetch;
}

/** @public */
export interface UnisynthCityCloudflarePagesOptions extends ServerRenderOptions {}

/** @public */
export interface PlatformCloudflarePages {
  request: Request;
  env?: Record<string, any>;
  ctx: { waitUntil: (promise: Promise<any>) => void };
}
