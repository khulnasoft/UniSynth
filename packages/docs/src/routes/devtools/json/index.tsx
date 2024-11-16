import type { RequestHandler } from '@khulnasoft.com/unisynth-city';
import { devtoolsJsonSRC } from '@khulnasoft.com/unisynth-labs';

export const onGet: RequestHandler = async ({ send, headers, cacheControl }) => {
  headers.set('Content-Type', 'application/javascript');
  headers.set('Access-Control-Allow-Origin', '*');
  cacheControl('no-cache');
  send(200, devtoolsJsonSRC);
};
