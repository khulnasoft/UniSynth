import type { RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onGet: RequestHandler = async ({ send, url }) => {
  const response = await fetch(
    new URL('/demo/unisynthcity/middleware/json/', url)
  );
  send(response.status, await response.text());
};
