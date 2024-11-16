import { type RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onRequest: RequestHandler = async ({ method, json }) => {
  json(200, { method });
};
