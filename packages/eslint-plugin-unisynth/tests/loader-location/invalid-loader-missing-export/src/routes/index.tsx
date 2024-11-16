// Expect error: { "messageId": "missingExport" }

import { routeLoader$ } from '@khulnasoft.com/unisynth-city';

const useFormLoader = routeLoader$(() => {
  return null;
});
