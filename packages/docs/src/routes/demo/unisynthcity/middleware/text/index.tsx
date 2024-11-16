import { type RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onGet: RequestHandler = async ({ text }) => {
  text(200, 'Text based response.');
};
