import { createUnisynthCity as createUnisynthCityNode } from '@khulnasoft.com/unisynth-city/middleware/node';
import type { ServerRenderOptions } from '@khulnasoft.com/unisynth-city/middleware/request-handler';
import type { UnisynthCityPlan } from 'packages/unisynth-city/src/runtime/src/types';
import type { UnisynthManifest, Render } from 'packages/unisynth/src/server/types';

interface AwsOpt {
  render: Render;
  manifest: UnisynthManifest;
  unisynthCityPlan: UnisynthCityPlan;
}

/** @public */
export function createUnisynthCity(opts: AwsOpt) {
  try {
    const { router, staticFile, notFound } = createUnisynthCityNode({
      render: opts.render,
      unisynthCityPlan: opts.unisynthCityPlan,
      manifest: opts.manifest,
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

    const fixPath = (pathT: string) => {
      if (opts.unisynthCityPlan.trailingSlash) {
        const url = new URL(pathT, 'http://aws-unisynth.local');
        if (url.pathname.includes('.', url.pathname.lastIndexOf('/'))) {
          return pathT;
        }
        if (!url.pathname.endsWith('/')) {
          return url.pathname + '/' + url.search;
        }
      }
      return pathT;
    };

    const handle = (req: any, res: any) => {
      req.url = fixPath(req.url);
      staticFile(req, res, () => {
        router(req, res, () => {
          notFound(req, res, () => {});
        });
      });
    };

    return { fixPath, router, staticFile, notFound, handle };
  } catch (err: any) {
    throw new Error(err.message);
  }
}

/** @public */
export interface UnisynthCityAwsLambdaOptions extends ServerRenderOptions {}

/** @public */
export interface PlatformAwsLambda extends Object {}
