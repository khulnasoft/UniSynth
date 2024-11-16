import { type RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onGet: RequestHandler = async ({ platform, json }) => {
  json(200, Object.keys(platform));
};
