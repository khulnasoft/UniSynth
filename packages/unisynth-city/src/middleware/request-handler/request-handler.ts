import type { Render } from '@khulnasoft.com/unisynth/server';
import { loadRoute } from '../../runtime/src/routing';
import type { UnisynthCityPlan } from '../../runtime/src/types';
import { renderUnisynthMiddleware, resolveRequestHandlers } from './resolve-request-handlers';
import type { UnisynthSerializer, ServerRenderOptions, ServerRequestEvent } from './types';
import { getRouteMatchPathname, runUnisynthCity, type UnisynthCityRun } from './user-response';

/**
 * The request handler for UnisynthCity. Called by every integration.
 *
 * @public
 */
export async function requestHandler<T = unknown>(
  serverRequestEv: ServerRequestEvent<T>,
  opts: ServerRenderOptions,
  unisynthSerializer: UnisynthSerializer
): Promise<UnisynthCityRun<T> | null> {
  const { render, unisynthCityPlan, manifest, checkOrigin } = opts;
  const pathname = serverRequestEv.url.pathname;
  const matchPathname = getRouteMatchPathname(pathname, unisynthCityPlan.trailingSlash);
  const routeAndHandlers = await loadRequestHandlers(
    unisynthCityPlan,
    matchPathname,
    serverRequestEv.request.method,
    checkOrigin ?? true,
    render
  );
  if (routeAndHandlers) {
    const [route, requestHandlers] = routeAndHandlers;
    return runUnisynthCity(
      serverRequestEv,
      route,
      requestHandlers,
      manifest,
      unisynthCityPlan.trailingSlash,
      unisynthCityPlan.basePathname,
      unisynthSerializer
    );
  }
  return null;
}

async function loadRequestHandlers(
  unisynthCityPlan: UnisynthCityPlan,
  pathname: string,
  method: string,
  checkOrigin: boolean,
  renderFn: Render
) {
  const { routes, serverPlugins, menus, cacheModules } = unisynthCityPlan;
  const route = await loadRoute(routes, menus, cacheModules, pathname);
  const requestHandlers = resolveRequestHandlers(
    serverPlugins,
    route,
    method,
    checkOrigin,
    renderUnisynthMiddleware(renderFn)
  );
  if (requestHandlers.length > 0) {
    return [route, requestHandlers] as const;
  }
  return null;
}
