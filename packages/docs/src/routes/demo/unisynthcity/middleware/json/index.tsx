import { type RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onGet: RequestHandler = async ({ json }) => {
  json(200, { hello: 'world' });
};
