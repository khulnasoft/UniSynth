import { type RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onGet: RequestHandler = async ({ basePathname, json }) => {
  json(200, { basePathname });
};
