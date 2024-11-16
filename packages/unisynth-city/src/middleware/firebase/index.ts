import { createUnisynthCity as createUnisynthCityNode } from '@khulnasoft.com/unisynth-city/middleware/node';

import type { ServerRenderOptions } from '@khulnasoft.com/unisynth-city/middleware/request-handler';

/** @public */
export function createUnisynthCity(opts: UnisynthCityFirebaseOptions) {
  const { staticFile, notFound, router } = createUnisynthCityNode({
    render: opts.render,
    manifest: opts.manifest,
    unisynthCityPlan: opts.unisynthCityPlan,
    static: {
      cacheControl: 'public, max-age=31557600',
    },
    getOrigin(req) {
      if (process.env.IS_OFFLINE) {
        return `http://${req.headers.host}`;
      }
      return null;
    },
  });

  const unisynthApp = (req: any, res: any) => {
    return staticFile(req, res, () => {
      router(req, res, () => notFound(req, res, () => {}));
    });
  };

  return unisynthApp;
}

/** @public */
export interface UnisynthCityFirebaseOptions extends ServerRenderOptions {}

/** @public */
export interface PlatformFirebase extends Object {}
