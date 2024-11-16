import { type RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onGet: RequestHandler = async ({ error }) => {
  throw error(500, 'ERROR: Demonstration of an error response.');
};
