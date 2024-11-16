import { component$, Resource, useResource$ } from '@khulnasoft.com/unisynth';
import { useLocation } from '@khulnasoft.com/unisynth-city';
import { getBuilderSearchParams, fetchOneEntry, Content } from '@builder.io/sdk-qwik';
import { UNISYNTH_MODEL } from '../../constants';

export default component$<{
  apiKey: string;
  model: string;
  tag: 'main' | 'div';
}>((props) => {
  const location = useLocation();
  const builderContentRsrc = useResource$<any>(({ cache }) => {
    const query = location.url.searchParams;
    // This helper function is needed because CF Workers don't support URLSearchParams.get
    const queryGet = (name: string) =>
      typeof query.get === 'function'
        ? query.get(name)
        : (query as unknown as Record<string, string>)[name];

    const render = queryGet('render');
    const contentId = props.model === UNISYNTH_MODEL ? queryGet('content') : undefined;
    const isSDK = render === 'sdk';
    cache('immutable');
    if (isSDK) {
      return getCachedValue(
        {
          model: props.model!,
          apiKey: props.apiKey!,
          options: getBuilderSearchParams(query),
          userAttributes: {
            urlPath: location.url.pathname,
            site: 'unisynth.dev',
          },
          ...(contentId && {
            query: {
              id: contentId,
            },
          }),
        },
        fetchOneEntry
      );
    } else {
      return getCachedValue(
        {
          apiKey: props.apiKey,
          model: props.model,
          urlPath: location.url.pathname,
          contentId: contentId,
        },
        getBuilderContent
      );
    }
  });

  return (
    <Resource
      value={builderContentRsrc}
      onPending={() => <div>Loading...</div>}
      onResolved={(content) =>
        content.html ? (
          <props.tag class="builder" dangerouslySetInnerHTML={content.html} />
        ) : (
          <Content model={props.model} content={content} apiKey={props.apiKey} />
        )
      }
    />
  );
});

export const isDev = import.meta.env.DEV;
export const CACHE = new Map<string, { timestamp: number; content: Promise<any> }>();
export function getCachedValue<T>(
  key: T,
  factory: (key: T) => Promise<any>,
  cacheTime = 1000 * 60 * 5 // 5 minutes
) {
  const now = Date.now();
  const keyString = JSON.stringify({
    ...key,
    // HACK
    // We ignore the urlPath for caching purposes as it would create way to many requests.
    // and we know that all of them are the same
    urlPath: '*',
  });
  const cacheValue = CACHE.get(keyString);
  if (cacheValue && cacheValue.timestamp + cacheTime > now) {
    return cacheValue.content;
  } else {
    const content = factory(key);
    CACHE.set(keyString, { timestamp: now, content });
    return content;
  }
}

export interface BuilderContent {
  html: string;
}

export async function getBuilderContent({
  apiKey,
  model,
  urlPath,
  contentId,
  cacheBust = false,
}: {
  apiKey: string;
  model: string;
  urlPath: string;
  contentId?: string | null;
  cacheBust?: boolean;
}): Promise<BuilderContent> {
  const unisynthUrl = new URL(
    'https://cdn.builder.io/api/v1/unisynth/' + model + (contentId ? '/' + contentId : '')
  );
  unisynthUrl.searchParams.set('apiKey', apiKey);
  unisynthUrl.searchParams.set('userAttributes.urlPath', urlPath);
  unisynthUrl.searchParams.set('userAttributes.site', 'unisynth.builder.io');
  if (cacheBust) {
    unisynthUrl.searchParams.set('cachebust', 'true');
  }

  try {
    const response = await fetch(unisynthUrl.href);
    if (response.ok) {
      const content: BuilderContent = JSON.parse(await response.text());
      return content;
    }
  } catch (err) {
    console.error(err);
  }
  return { html: `<div>Unable to load Builder content from ${unisynthUrl.toString()}</div>` };
}
