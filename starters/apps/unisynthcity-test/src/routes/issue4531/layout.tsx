import type { RequestHandler } from "@khulnasoft.com/unisynth-city";

export const onRequest: RequestHandler<void> = async (onRequestArgs) => {
  const { headers } = onRequestArgs;
  headers.set("x-unisynthcity-test", "issue4531");
};
