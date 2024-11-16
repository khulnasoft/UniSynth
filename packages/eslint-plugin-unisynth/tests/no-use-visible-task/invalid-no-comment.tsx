// Expect error: { "messageId": "noUseVisibleTask" }

import { component$, useVisibleTask$ } from '@khulnasoft.com/unisynth';
export default component$(() => {
  useVisibleTask$(() => {});
  return <></>;
});
