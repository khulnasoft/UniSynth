import { type RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onGet: RequestHandler = async ({ cookie, json }) => {
  let count = cookie.get('Unisynth.demo.count')?.number() || 0;
  count++;
  cookie.set('Unisynth.demo.count', count);
  json(200, { count });
};
