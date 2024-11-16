// Expect error: { "messageId": "referencesOutside" }
import { component$, useTask$, useSignal } from '@khulnasoft.com/unisynth';

export default component$(() => {
  enum Color {
    Red,
    Blue,
    Green,
  }
  const color = useSignal({ color: Color.Red });
  useTask$(() => {
    color.value.color = Color.Blue;
  });
  return <></>;
});
