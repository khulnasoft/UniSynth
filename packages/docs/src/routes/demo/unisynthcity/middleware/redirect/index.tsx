import { type RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onGet: RequestHandler = async ({ redirect, url }) => {
  throw redirect(
    308,
    new URL('/demo/unisynthcity/middleware/status/', url).toString()
  );
};
