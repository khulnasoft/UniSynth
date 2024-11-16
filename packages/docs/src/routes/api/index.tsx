import { $, component$, useOn, useSignal, useStore, useTask$ } from '@khulnasoft.com/unisynth';
import { isBrowser } from '@khulnasoft.com/unisynth/build';
import { toSnakeCase } from '../../utils/utils';

// TODO: load the content of these files using fs instead of importing them
import unisynthCityMiddlewareAzureSwaApiData from './unisynth-city-middleware-azure-swa/api.json';
import unisynthCityMiddlewareCloudflarePagesApiData from './unisynth-city-middleware-cloudflare-pages/api.json';
import unisynthCityMiddlewareFirebaseApiData from './unisynth-city-middleware-firebase/api.json';
import unisynthCityMiddlewareNetlifyEdgeApiData from './unisynth-city-middleware-netlify-edge/api.json';
import unisynthCityMiddlewareNodeApiData from './unisynth-city-middleware-node/api.json';
import unisynthCityMiddlewareRequestHandlerApiData from './unisynth-city-middleware-request-handler/api.json';
import unisynthCityMiddlewareVercelEdgeApiData from './unisynth-city-middleware-vercel-edge/api.json';
import unisynthCityStaticApiData from './unisynth-city-static/api.json';
import unisynthCityViteAzureSwaApiData from './unisynth-city-vite-azure-swa/api.json';
import unisynthCityViteCloudRunApiData from './unisynth-city-vite-cloud-run/api.json';
import unisynthCityViteCloudflarePagesApiData from './unisynth-city-vite-cloudflare-pages/api.json';
import unisynthCityViteNetlifyEdgeApiData from './unisynth-city-vite-netlify-edge/api.json';
import unisynthCityViteNodeServerApiData from './unisynth-city-vite-node-server/api.json';
import unisynthCityViteStaticApiData from './unisynth-city-vite-static/api.json';
import unisynthCityViteVercelApiData from './unisynth-city-vite-vercel/api.json';
import unisynthCityApiData from './unisynth-city/api.json';
import unisynthOptimizerApiData from './unisynth-optimizer/api.json';
import unisynthServerApiData from './unisynth-server/api.json';
import unisynthTestingApiData from './unisynth-testing/api.json';
import unisynthApiData from './unisynth/api.json';

const _KINDS = new Set<string>();

const apiData = {
  unisynth: unisynthApiData,
  'unisynth-city': unisynthCityApiData,
  'unisynth-city-middleware-azure-swa': unisynthCityMiddlewareAzureSwaApiData,
  'unisynth-city-middleware-cloudflare-pages': unisynthCityMiddlewareCloudflarePagesApiData,
  'unisynth-city-middleware-netlify-edge': unisynthCityMiddlewareNetlifyEdgeApiData,
  'unisynth-city-middleware-node': unisynthCityMiddlewareNodeApiData,
  'unisynth-city-middleware-request-handler': unisynthCityMiddlewareRequestHandlerApiData,
  'unisynth-city-middleware-vercel-edge': unisynthCityMiddlewareVercelEdgeApiData,
  'unisynth-city-middleware-firebase': unisynthCityMiddlewareFirebaseApiData,
  'unisynth-city-static': unisynthCityStaticApiData,
  'unisynth-city-vite-azure-swa': unisynthCityViteAzureSwaApiData,
  'unisynth-city-vite-cloud-run': unisynthCityViteCloudRunApiData,
  'unisynth-city-vite-cloudflare-pages': unisynthCityViteCloudflarePagesApiData,
  'unisynth-city-vite-node-server': unisynthCityViteNodeServerApiData,
  'unisynth-city-vite-netlify-edge': unisynthCityViteNetlifyEdgeApiData,
  'unisynth-city-vite-static': unisynthCityViteStaticApiData,
  'unisynth-city-vite-vercel': unisynthCityViteVercelApiData,
  'unisynth-optimizer': unisynthOptimizerApiData,
  'unisynth-server': unisynthServerApiData,
  'unisynth-testing': unisynthTestingApiData,
};

const getUniqueKinds = () => {
  if (_KINDS.size) {
    return _KINDS;
  }

  apiData['unisynth'].members.forEach((member) => _KINDS.add(toSnakeCase(member.kind)));
  return _KINDS;
};

const getInitialFilterState = () => {
  return (
    Array.from(getUniqueKinds()).reduce((acc: any, kind) => {
      if (typeof kind !== 'string') {
        return acc;
      }
      acc[kind] = true;
      return acc;
    }, {}) || {}
  );
};

export default component$(() => {
  const filters = useStore(getInitialFilterState());

  return (
    <>
      <h1 class="overview">API Reference</h1>

      <h2>Filters</h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-10">
        {Array.from(getUniqueKinds()).map((kind) => (
          <button
            key={`filter-${kind}`}
            onClick$={() => {
              filters[kind] = !filters[kind];
            }}
            class={`filter-item block text-sm rounded-md text-left ${
              filters[kind] ? 'active' : ''
            }`}
            data-kind-label={kind.substring(0, 1).toUpperCase()}
          >
            {kind.split('-').join(' ')}
          </button>
        ))}
      </div>

      <h2>References</h2>
      {Object.keys(apiData).map((key) => (
        <ApiMemberWrapper key={`api-member-wrapper-${apiData[key as keyof typeof apiData].id}`} id={apiData[key as keyof typeof apiData].id} data={apiData[key as keyof typeof apiData]} filters={filters} />
      ))}
    </>
  );
});

export const ApiMemberWrapper = component$(({ id, data, filters }: any) => {
  const isCollapsed = useSignal(true);

  useTask$(({track}) => {
    track(filters);
    if (isBrowser) {
      isCollapsed.value = false;
    }
  });

  // TODO: find a solution to get this work
  useOn('beforematch', $(() => {
    isCollapsed.value = false;
  }));

  if(!data.members.length) {
    return null;
  }

  return (
    <div class={`section ${isCollapsed.value}`}>
      <h2
        data-icon={isCollapsed.value ? '→' : '↓'}
        class="section-title cursor-pointer"
        onClick$={(e) => isCollapsed.value = !isCollapsed.value }
      >
        <span>{data.id}</span>
      </h2>
      <div hidden={isCollapsed.value ? 'until-found' : false}>
        <ApiMemberList id={id} data={data} filters={filters} />
      </div>
    </div>
  );
});


export const ApiMemberList = component$(({ id, data, filters }: any) => (
  <ul class="grid sm:grid-cols-2 lg:grid-cols-3 pb-5">
    {data.members.map((member: any) => {
      const kind = toSnakeCase(member.kind);

      if (!member.name) {
        return;
      }

      const name = member.name.toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/ /g, '-');


      return (
        <li
          key={`${id}-member-${member.id}-${kind}`}
          data-kind={kind}
          data-kind-label={kind.substring(0, 1).toUpperCase()}
          class={`api-item list-none text-xs ${
            (kind in filters && !filters[kind] && 'hidden') || ''
          }`}
        >
          <a href={`${data.id}#${name}`}>{member.name}</a>
        </li>
      );
    })}
  </ul>
));
